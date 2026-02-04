import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Mail, Phone, Facebook, Instagram } from 'lucide-react' // Usando Lucide para consistência
import api from 'services/api'



// Definição do tipo de dados
interface CubProps {
  monthYear: string
  cubValue: string
  monthPercentage: string
  yearPercentage: string
  twelveMonthsPercentage: string
}

// Função de busca de dados (Roda no servidor)
// async function getCubInformation(): Promise<CubProps | null> {
//   try {
//     // const response = await api.get('/cub-information')
//     return [{ monthYear: "01/2024", cubValue: "R$ 1.200,00", monthPercentage: "+2%", yearPercentage: "+15%", twelveMonthsPercentage: "+35%" }]
//   } catch (error) {
//     console.error("Erro ao buscar CUB:", error)
//     return null
//   }
// }

export default async function Footer() {
  // A busca acontece aqui, antes de renderizar o HTML
  // const cubInformation = await getCubInformation()

  return (
    <footer className="flex flex-col">
      {/* Seção Principal - Azul Claro */}
      <div className="bg-[#17375F] text-white py-10 px-4">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-4">

          {/* Coluna 1: Logo */}
          <div className="flex items-center justify-center">
            <Image src="/logo-full.svg" alt="Auros Logo" width={160} height={160} className="w-40" />
          </div>

          {/* Coluna 2: Rio do Sul */}
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left w-full md:w-auto">
            <h3 className="text-base font-semibold border-b border-white pb-1 mb-1 w-fit">
              Rio do Sul
            </h3>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={18} className="shrink-0 mt-0.5" />
              <p className="max-w-[200px]">
                R. XV de Novembro, 1751 - sala 02, Laranjeiras, Rio do Sul - SC
              </p>
            </div>
            <Link
              href="https://api.whatsapp.com/send?phone=5547999008090&&text=Olá, vim pelo site"
              className="flex items-center gap-3 text-sm hover:text-gray-300 transition-colors"
            >
              <Phone size={18} className="shrink-0" />
              <span>(47) 99900-8090</span>
            </Link>
          </div>

          {/* Coluna 3: Balneário Camboriú */}
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left w-full md:w-auto">
            <h3 className="text-base font-semibold border-b border-white pb-1 mb-1 w-fit">
              Balneário Camboriú
            </h3>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={18} className="shrink-0 mt-0.5" />
              <p className="max-w-[200px]">
                Rua 2000, 121, La Belle Tour Résidence - sala 11, Centro - Balneário Camboriú/ SC
              </p>
            </div>
            <Link
              href="https://api.whatsapp.com/send?phone=5547988163739&&text=Olá, vim pelo site"
              className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors"
            >
              <Phone size={18} className="shrink-0" />
              <span>(47) 98816-3739</span>
            </Link>
          </div>

          {/* Coluna 4: Contato & Social */}
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left w-full md:w-auto">
            <h3 className="text-base font-semibold border-b border-white pb-1 mb-1 w-fit">
              Contato
            </h3>

            <Link href="https://www.instagram.com/auroscorretoraimobiliaria/" className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors">
              <Instagram size={18} />
              <span>@auroscorretoraimobiliaria</span>
            </Link>

            <Link href="https://www.facebook.com/AurosCorretoraImob?locale=pt_BR" className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors">
              <Facebook size={18} />
              <span>@auroscorretoraimobiliaria</span>
            </Link>

            <Link href="mailto:aurosimobiliaria@gmail.com" className="flex items-center gap-2 text-sm hover:text-gray-300 transition-colors">
              <Mail size={18} />
              <span>aurosimobiliaria@gmail.com</span>
            </Link>
          </div>

          {/* Coluna 5: Tabela CUB (Server Data) */}
          <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left w-full md:w-auto text-sm">
            {/* <h3 className="text-base font-semibold border-b border-white pb-1 mb-2 w-fit">
              Tabela do CUB SC
            </h3> */}
            {/* {cubInformation ? (
              <>
                <p>Mês/Ano: {cubInformation.monthYear}</p>
                <p>CUB SC (R$/m²): {cubInformation.cubValue}</p>
                <p>Mês (%): {cubInformation.monthPercentage}</p>
                <p>Ano (%): {cubInformation.yearPercentage}</p>
                <p>12 meses (%): {cubInformation.twelveMonthsPercentage}</p>
              </>
            ) : (
              <p className="opacity-70 text-xs">Informações indisponíveis</p>
            )} */}
          </div>

        </div>
      </div>

      {/* Faixa Inferior - Azul Escuro */}
      <div className="bg-[#153358] text-white py-4 px-4 text-xs">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <p className="opacity-80">
            Auros corretora imobiliária - CRECI-SC 7018-J (Rio do Sul ) CRECI-SC 8732-J (Balneário Camboriú)
          </p>

          <Link
            href="https://www.codelabz.com.br/"
            target="_blank"
            className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
          >
            <span>Desenvolvido por:</span>
            <Image src="/codelabz.svg" alt="Code Labz" width={20} height={20} />
          </Link>
        </div>
      </div>
    </footer>
  )
}