use assert_cmd::Command;
use predicates::prelude::*;

#[test]
fn demo_writes_both_receipts() {
    let temp = tempfile::tempdir().unwrap();
    Command::cargo_bin("rehearsal")
        .unwrap()
        .args(["demo", "--output", temp.path().to_str().unwrap()])
        .assert()
        .success()
        .stdout(predicate::str::contains("READY"));
    assert!(temp.path().join("report/readiness.json").is_file());
    assert!(temp.path().join("report/readiness.html").is_file());
    let receipt = std::fs::read_to_string(temp.path().join("report/readiness.json")).unwrap();
    assert!(receipt.contains("Restore backup"));
    assert!(!receipt.contains("three synthetic workspaces"));
}

#[test]
fn bad_declaration_explains_the_next_step() {
    let temp = tempfile::tempdir().unwrap();
    let path = temp.path().join("bad.yml");
    std::fs::write(&path, "schema: 8\n").unwrap();
    Command::cargo_bin("rehearsal")
        .unwrap()
        .args(["check", "--file", path.to_str().unwrap()])
        .assert()
        .failure()
        .stderr(predicate::str::contains(
            "not a valid rehearsal declaration",
        ));
}

#[test]
fn demo_refuses_to_overwrite_a_nonempty_directory() {
    let temp = tempfile::tempdir().unwrap();
    std::fs::write(temp.path().join("keep.txt"), "keep me").unwrap();
    Command::cargo_bin("rehearsal")
        .unwrap()
        .args(["demo", "--output", temp.path().to_str().unwrap()])
        .assert()
        .failure()
        .stderr(predicate::str::contains("is not empty"));
    assert_eq!(
        std::fs::read_to_string(temp.path().join("keep.txt")).unwrap(),
        "keep me"
    );
}

#[test]
fn receipt_redacts_declaration_notes_before_marking_it_customer_safe() {
    let temp = tempfile::tempdir().unwrap();
    let declaration = temp.path().join("rehearsal.yml");
    let source = std::fs::read_to_string("examples/arbor-desk/rehearsal.yml").unwrap();
    let secret = "Customer ACME host db.customer.internal token secret-123";
    let binary = assert_cmd::cargo::cargo_bin("rehearsal")
        .to_string_lossy()
        .replace('\\', "\\\\");
    std::fs::write(
        &declaration,
        source
            .replace("notes: Synthetic records only", &format!("notes: {secret}"))
            .replace("[rehearsal,", &format!("[\"{binary}\",")),
    )
    .unwrap();
    std::fs::copy(
        "examples/arbor-desk/schema-1.8.yml",
        temp.path().join("schema-1.8.yml"),
    )
    .unwrap();
    std::fs::copy(
        "examples/arbor-desk/schema-2.0.yml",
        temp.path().join("schema-2.0.yml"),
    )
    .unwrap();

    // Use the bundled binary for fixture hooks while keeping the declaration
    // and output in a fresh directory, just as a customer would.
    let output = temp.path().join("report");
    Command::cargo_bin("rehearsal")
        .unwrap()
        .args([
            "run",
            "--file",
            declaration.to_str().unwrap(),
            "--output",
            output.to_str().unwrap(),
        ])
        .assert()
        .success();
    let receipt = std::fs::read_to_string(output.join("readiness.json")).unwrap();
    assert!(receipt.contains("\"customer_safe\": true"));
    assert!(!receipt.contains(secret));
    assert!(!receipt.contains("\"notes\""));
}
