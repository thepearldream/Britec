using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models.ControleAplicacao
{
    public class Resumo
    {
        public double CargaAcumulada { get; set; }
        public double EspessuraMedia { get; set; }
        public double AreaTotal { get; set; }
        public long QuantidadeCaminhoes { get; set; }
        public double ValorTonelada { get; set; }
        public double ValorTotalBrutoFrete { get; set; } 
    }
}