const Footer = () => {
  // Rendu du composant
  return (
    <footer className="flex justify-center items-center p-8 bg-[#0c1017] text-white text-center">
      <p className='text-xs'>
        Tous droits réservés - Copyright Les Créas De Lilou & Fondants Event &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;