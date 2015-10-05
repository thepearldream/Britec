using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models.Obra
{
    public class Obra
    {
        public long id { get; set; }
        public string descricao { get; set; }
        public DateTime dataInicio { get; set; }
        public DateTime dataFimPrevisto { get; set; }
        public Nullable<DateTime>  dataFim { get; set; }
        public string cliente { get; set; }
        public string local { get; set; }
        public double valorFrete { get; set; }
    }
}