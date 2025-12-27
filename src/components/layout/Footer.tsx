import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">O</span>
              </div>
              <span className="font-bold text-xl text-secondary-foreground">
                Okan <span className="text-secondary-foreground/70 text-sm font-normal">| dev studies</span>
              </span>
            </div>
            <p className="text-secondary-foreground/80 max-w-md">
              Plataforma educacional de tecnologia focada em construir caminhos reais de aprendizado e transformação social para pessoas negras.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-semibold mb-4">Trilhas</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><Link to="/trilhas/frontend" className="hover:text-primary transition-colors">Front-end</Link></li>
              <li><Link to="/trilhas/backend" className="hover:text-primary transition-colors">Back-end</Link></li>
              <li><Link to="/trilhas/mobile" className="hover:text-primary transition-colors">Mobile</Link></li>
              <li><Link to="/trilhas/dados" className="hover:text-primary transition-colors">Dados</Link></li>
              <li><Link to="/trilhas/ux-design" className="hover:text-primary transition-colors">UX & Design</Link></li>
            </ul>
          </div>

          {/* Links Institucionais */}
          <div>
            <h4 className="font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2 text-secondary-foreground/80">
              <li><Link to="/sobre" className="hover:text-primary transition-colors">Sobre o Okan</Link></li>
              <li><Link to="/impacto" className="hover:text-primary transition-colors">Impacto Social</Link></li>
              <li><Link to="/parceiros" className="hover:text-primary transition-colors">Parceiros</Link></li>
              <li><Link to="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-foreground/60 text-sm">
            © {new Date().getFullYear()} Okan | dev studies. Todos os direitos reservados.
          </p>
          <p className="text-secondary-foreground/60 text-sm flex items-center gap-1">
            Feito com <Heart size={14} className="text-primary" /> para transformar vidas
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
