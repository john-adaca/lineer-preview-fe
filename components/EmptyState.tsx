export default function EmptyState() {
  return (
    <div className="text-center py-16 px-8 text-gray-500">
      <svg
        className="w-20 h-20 mx-auto mb-5 opacity-50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <p>Enter a LinkedIn profile URL and click &quot;Generate Topics&quot; to get started</p>
    </div>
  )
}



