using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models.ControleAplicacao
{
    public class Frete
    {
        public string Motorista { get; set; }
        public double Toneladas { get; set; }
        public int Viagens { get; set; }
        public double MediaToneladasViagem { get; set; }
        public double ValorBruto { get; set; }
    }
}