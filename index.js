/**
 * Host half of the Naiwa desk-pet bundle.
 *
 * The pet is intentionally a Client-only surface: it renders in the existing
 * Web UI through `shell.overlay`, reads public session Snapshots through the
 * slot's standard props, and keeps its preferences in local storage. No
 * Host-side state, network request, or profile edit is needed.
 */
export function apply() {}
