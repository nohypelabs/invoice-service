export default function Home() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Service</h1>
        <p className="text-gray-600 mb-6">
          Multi-project invoice generator API.
        </p>
        <div className="bg-white rounded-lg border p-4 text-left text-sm text-gray-600 font-mono">
          <p className="mb-2">POST <span className="text-blue-600">/api/invoices</span> — Create & generate invoice</p>
          <p className="mb-2">GET <span className="text-blue-600">/api/invoices</span> — List invoices</p>
          <p className="mb-2">GET <span className="text-blue-600">/api/invoices/:id/pdf</span> — Download PDF</p>
          <p>POST <span className="text-blue-600">/api/templates</span> — Register project config</p>
        </div>
      </div>
    </main>
  );
}
