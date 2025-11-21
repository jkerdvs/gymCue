// src/components/ui/card.jsx
export function Card({ children, className }) {
  return (
    <div className={`rounded-2xl shadow-md bg-white dark:bg-gray-900 p-4 ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-2 border-b pb-2">{children}</div>;
}

export function CardTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
