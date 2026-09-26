import { render, screen } from "@testing-library/react";
import * as axe from "axe-core";
import { vi } from "vitest";
import App, { PlanDialog } from "./App";
import type { MutationPlanView } from "./generated/types";

vi.mock("./lib/api", () => ({
  desktopApi: {
    listenForChanges: vi.fn().mockResolvedValue(() => undefined),
    selectRepository: vi.fn(),
    overview: vi.fn(),
    workItems: vi.fn(),
    decisions: vi.fn(),
    evidence: vi.fn(),
  },
}));

describe("workbench shell", () => {
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
});
