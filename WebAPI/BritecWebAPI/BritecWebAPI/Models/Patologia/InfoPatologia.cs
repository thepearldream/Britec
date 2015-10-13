using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models.Patologia
{
    public class InfoPatologia
    {
        public long Id { get; set; }
        public long Obra_id { get; set; }
        public string Observacao { get; set; }
        public List<InfoImagemPatologia> imagens { get; set; }
    }
}