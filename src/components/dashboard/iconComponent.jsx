const IconComponent = ({ icon, href, name }) => {
  return (
    <a href={href} target="_blank" className={`d-flex flex-wrap align-items-center justify-content-center ${name}`} rel="noreferrer">
      <img src={icon} alt={name} className="footer-Icon" />
    </a>
  );
};

export default IconComponent;
