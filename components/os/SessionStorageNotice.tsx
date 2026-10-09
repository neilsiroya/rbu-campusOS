export function SessionStorageNotice({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      data-notice="error"
      className="rounded-lg border border-danger/20 bg-danger/10 px-3 py-2 text-xs text-danger"
    >
      {message}
    </p>
  );
}
