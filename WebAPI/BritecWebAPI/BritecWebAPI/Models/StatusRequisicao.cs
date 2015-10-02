using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models
{
    public class StatusRequisicao
    {
        public bool sucesso { get; set; }
        public string mensagem { get; set; }
        public object dados { get; set; }
    }
}