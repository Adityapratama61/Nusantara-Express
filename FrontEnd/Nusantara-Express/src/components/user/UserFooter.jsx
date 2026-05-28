const UserFooter = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-bold uppercase text-slate-950">
            Nusantara Express
          </h3>
          <p className="mt-2">
            © 2026 Nusantara Express Logistics. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
          <span>Contact Support</span>
          <span>Global Network</span>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
