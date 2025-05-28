const Footer: React.FC = () => {
  return (
    <footer className="text-white text-center bg-[#f8f9f7] w-full py-4 flex flex-col justify-end h-12">
      <p className="text-sm text-black">
        &copy; {new Date().getFullYear()} Car Crashes Dashboard. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
