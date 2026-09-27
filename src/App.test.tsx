import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as axe from "axe-core";
import { vi } from "vitest";
import App, { PlanDialog } from "./App";
import { desktopApi } from "./lib/api";
import type { MutationApplyView, MutationPlanView, RepositoryOverview } from "./generated/types";

vi.mock("./lib/api", () => ({
  desktopApi: {
    listenForChanges: vi.fn().mockResolvedValue(() => undefined),
    selectRepository: vi.fn(),
    overview: vi.fn(),
    workItems: vi.fn(),
    decisions: vi.fn(),
    evidence: vi.fn(),
    validate: vi.fn(),
    graph: vi.fn(),
    analyze: vi.fn(),
    plan: vi.fn(),
    apply: vi.fn(),
    discard: vi.fn(),
    refresh: vi.fn(),
  },
}));

function repositoryOverview(root: string, generation: number): RepositoryOverview {
  return {
    session_id: `session-${generation}`,
    generation,
    identity: { root, git_common_dir: null, git_worktree_root: null, linked_worktree: false },
    validation: { valid: true, diagnostics: [], error_count: 0, warning_count: 0 },
    work_item_count: 75,
    evidence_count: 181,
    decision_count: 75,
    graph_node_count: 0,
    graph_edge_count: 0,
    snapshot_token: `snapshot-${generation}`,
    watcher: { state: "running", recursive: true, debounce_ms: 50 },
  };
}

function configureRepositoryLoading(first: RepositoryOverview, second: RepositoryOverview) {
  vi.mocked(desktopApi.selectRepository).mockResolvedValueOnce(first).mockResolvedValueOnce(second);
  vi.mocked(desktopApi.overview).mockResolvedValue(first);
  vi.mocked(desktopApi.workItems).mockResolvedValue([]);
  vi.mocked(desktopApi.decisions).mockResolvedValue([]);
  vi.mocked(desktopApi.evidence).mockResolvedValue([]);
  vi.mocked(desktopApi.validate).mockResolvedValue(first.validation);
  vi.mocked(desktopApi.graph).mockResolvedValue({
    nodes: [],
    edges: [],
    status: {
      basis: "working_overlay",
      durable_freshness: "absent",
      coverage: "complete",
      baseline_fingerprint: null,
      effective_fingerprint: "fingerprint",
      changed_path_count: 0,
      overlay_generation: first.generation,
    },
  });
  vi.mocked(desktopApi.analyze).mockResolvedValue({ findings: [] });
}

describe("workbench shell", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders a keyboard-addressable empty repository state", () => {
    render(<App />);
    expect(screen.getByRole("navigation", { name: "Workbench sections" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Select a repository to begin" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Choose repository" })).toBeEnabled();
  });

  it("keeps plan review explicit and accessible", async () => {
    const plan: MutationPlanView = {
      session_id: "session-1",
      plan_handle: "plan-1-1",
      plan_token: "token",
      intent: { kind: "transition_work_item", payload: { id: "001", status: "blocked" } },
      diagnostics: [],
      generated_impacts: [],
      graph_impacts: [],
      preview: "rename work/active/001-item work/blocked/001-item",
      applicable: true,
    };
    const { container } = render(<PlanDialog plan={plan} onApply={vi.fn()} onDiscard={vi.fn()} busy={false} />);
    expect(screen.getByRole("dialog", { name: "Review proposed mutation" })).toBeInTheDocument();
    expect(screen.getByText("Opaque plan handle")).toBeInTheDocument();
    expect(screen.getByText("Applicable — ready for your review")).toBeInTheDocument();
    expect(screen.getByText("No diagnostics reported.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply approved plan" })).toBeEnabled();
    expect((await axe.run(container)).violations).toEqual([]);
  });

  it("shows blocking diagnostics before approval and disables apply", () => {
    const plan: MutationPlanView = {
      session_id: "session-1",
      plan_handle: "plan-1-2",
      plan_token: "token",
      intent: { kind: "transition_work_item", payload: { id: "001", status: "completed" } },
      diagnostics: [{ code: "work.completed-pending-criterion", message: "Acceptance criterion AC-1 is pending.", path: "work/active/001-item/work-item.json", blocking: true, related_records: [] }],
      generated_impacts: [],
      graph_impacts: [],
      preview: "No preview was generated.",
      applicable: false,
    };
    render(<PlanDialog plan={plan} onApply={vi.fn()} onDiscard={vi.fn()} busy={false} />);
    expect(screen.getByText("Blocked — cannot be approved")).toBeInTheDocument();
    expect(screen.getByText("1 blocking diagnostic must be resolved.")).toBeInTheDocument();
    expect(screen.getByText("work.completed-pending-criterion")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply approved plan" })).toBeDisabled();
  });

  it("clears the applied result and creation draft when switching repositories", async () => {
    const first = repositoryOverview("C:/disposable/repository-one", 1);
    const second = repositoryOverview("C:/disposable/repository-two", 2);
    configureRepositoryLoading(first, second);
    let finishSecondRepositoryLoad!: (items: []) => void;
    const secondRepositoryLoad = new Promise<[]>(resolve => { finishSecondRepositoryLoad = resolve; });
    vi.mocked(desktopApi.workItems)
      .mockReset()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockReturnValueOnce(secondRepositoryLoad);

    const plan: MutationPlanView = {
      session_id: first.session_id,
      plan_handle: "plan-1-1",
      plan_token: "session-bound-token",
      intent: { kind: "transition_work_item", payload: { id: "001", status: "blocked" } },
      diagnostics: [],
      generated_impacts: [],
      graph_impacts: [],
      preview: "add proposed disposable probe",
      applicable: true,
    };
    vi.mocked(desktopApi.plan).mockResolvedValue(plan);
    const applied: MutationApplyView = {
      session_id: first.session_id,
      generation: first.generation + 1,
      plan_token: plan.plan_token,
      success: true,
      rolled_back: false,
      stale: false,
      changed_paths: ["work/proposed/075-probe/work-item.json"],
      diagnostics: [],
    };
    vi.mocked(desktopApi.apply).mockResolvedValue(applied);

    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Select a repository to begin" });
    await user.click(await screen.findByRole("button", { name: "Choose repository" }));
    await screen.findByText(first.identity.root);
    await user.click(await screen.findByRole("button", { name: "Work" }));
    await user.click(await screen.findByRole("button", { name: "Create work item" }));

    await user.type(await screen.findByLabelText("Title"), "RPS-009 disposable desktop mutation probe");
    await user.click(await screen.findByRole("button", { name: "Continue to guidance" }));
    const criterion = await screen.findByLabelText("Acceptance criteria, one per line");
    await user.type(criterion, "Disposable UI mutation proof");
    await user.click(await screen.findByRole("button", { name: "Review details" }));
    const preflight = await screen.findByRole("checkbox", { name: "I confirm this work item is being registered before implementation begins." });
    await user.click(preflight);
    await user.click(await screen.findByRole("button", { name: "Create review plan" }));
    await screen.findByRole("dialog", { name: "Review proposed mutation" });
    await user.click(await screen.findByRole("button", { name: "Apply approved plan" }));

    await screen.findByText("Plan applied and post-validation completed.");
    expect(screen.getByRole("heading", { name: "New work item" })).toBeInTheDocument();

    fireEvent.click(await screen.findByRole("button", { name: "Switch repository" }));
    await screen.findByRole("heading", { name: "Select a repository to begin" });
    expect(screen.queryByText(first.identity.root)).not.toBeInTheDocument();
    expect(screen.queryByText("Plan applied and post-validation completed.")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "New work item" })).not.toBeInTheDocument();

    finishSecondRepositoryLoad([]);
    await screen.findByText(second.identity.root);
    await waitFor(() => {
      expect(screen.queryByText("Plan applied and post-validation completed.")).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "New work item" })).not.toBeInTheDocument();
      expect(screen.queryByDisplayValue("RPS-009 disposable desktop mutation probe")).not.toBeInTheDocument();
    });
    expect(desktopApi.apply).toHaveBeenCalledTimes(1);
  });
});
