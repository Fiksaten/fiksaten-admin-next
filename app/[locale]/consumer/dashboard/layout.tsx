type LayoutProps = {
  children: React.ReactNode;
};

export default async function ConsumerDashboard({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
