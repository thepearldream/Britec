using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models
{
    public class ParansLista
    {
        public int cursor { get; set; }
        public int limite { get; set; }
        public string buscar { get; set; }
    }
}