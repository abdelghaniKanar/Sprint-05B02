const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-bold">BackRoom</p>
            <p className="text-sm text-slate-300">
              Secure Authentication System
            </p>
          </div>

          <div className="text-sm text-slate-300">
            &copy; {currentYear} BackRoom. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
