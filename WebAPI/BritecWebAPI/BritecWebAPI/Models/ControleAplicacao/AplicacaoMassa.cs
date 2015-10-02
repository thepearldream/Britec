using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models.ControleAplicacao
{
    public class AplicacaoMassa : ParansInfoUsuario
    {
        public Nullable<long> id { get; set; }
        public string Nota { get; set; }
        public long Fase_id { get; set; }
        public double Estaca { get; set; }
        public DateTime data { get; set; }
        public DateTime HoraInicio { get; set; }
        public DateTime HoraFim { get; set; }
        public long Motorista_id { get; set; }
        public long Veiculo_id { get; set; }
        public double Largura { get; set; }
        public double Comprimento { get; set; }
        public double Toneladas { get; set; }
        public double Temperatura { get; set; }
        public double Espessura { get; set; }
    }
}