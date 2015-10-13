using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models.Patologia
{
    public class InfoImagemPatologia
    {
        public long Id { get; set; }
        public long Patologia_id { get; set; }
        public string Imagem { get; set; }
        public DateTime Data { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
    }
}