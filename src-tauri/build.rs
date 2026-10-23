fn main() {
    // MSVC otherwise embeds link-time timestamps and a fresh CodeView identity
    // in each PE image. /Brepro makes those PE fields deterministic from the
    // linked inputs. Scope it to the Windows desktop executable and leave
    // non-MSVC targets and the shared Tauri library unchanged.
    if let Ok(target) = std::env::var("TARGET") {
        if target.ends_with("-windows-msvc") {
            println!("cargo:rustc-link-arg-bin=repopact-desktop=/Brepro");
        }
    }

    tauri_build::build()
}
