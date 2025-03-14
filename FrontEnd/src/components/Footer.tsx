import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PharmaCare</h3>
            <p className="text-gray-300 mb-4">Ваш надежный партнер в сфере здравоохранения.</p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                title="ВКонтакте"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.725-1.033-1.003-1.49-1.135-1.745-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202-2.17-3.048-2.763-5.335-2.763-5.812 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.848 2.442 2.274 4.578 2.867 4.578.22 0 .322-.102.322-.66V9.793c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.747c.372 0 .5.203.5.643v3.473c0 .372.17.5.271.5.22 0 .407-.128.813-.542 1.27-1.422 2.172-3.61 2.172-3.61.119-.254.322-.491.762-.491h1.744c.525 0 .643.27.525.643-.22 1.017-2.375 4.069-2.375 4.069-.186.305-.254.44 0 .78.186.254.796.779 1.202 1.253.745.847 1.32 1.558 1.473 2.036.17.491-.085.745-.576.745z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                title="Telegram"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.12.098.153.228.166.336.032.272-.012 2.784-.012 2.784z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-white transition-colors"
                title="Одноклассники"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.8c1.987 0 3.6 1.613 3.6 3.6S13.987 12 12 12s-3.6-1.613-3.6-3.6S10.013 4.8 12 4.8zm0 12.24c-2.786 0-5.255-1.136-7.012-2.97.041-1.17 3.501-1.81 7.012-1.81 3.511 0 6.971.64 7.012 1.81-1.757 1.834-4.226 2.97-7.012 2.97zm0-8.64c1.325 0 2.4-1.075 2.4-2.4S13.325 3.6 12 3.6 9.6 4.675 9.6 6s1.075 2.4 2.4 2.4z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Быстрые ссылки</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">О нас</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Товары</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Акции</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Контакты</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Контактная информация</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@pharmacare.ru</span>
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>ул. Аптечная, 123</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Режим работы</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Пн-Пт: 8:00 - 20:00</span>
              </li>
              <li className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>Сб-Вс: 9:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-300">&copy; 2024 PharmaCare. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;