using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Http;
using BritecWebAPI.Models;

namespace BritecWebAPI.Controllers
{
    public class motoristasController : ApiController
    {
        private britecEntities db = new britecEntities();

        [HttpPost]
        public List<InfoMotorista> getMotoristas()
        {
            var lstMotorista = new List<InfoMotorista>();
            var rowsMotoristas = db.motorista.OrderBy(m => m.nome + m.sobrenome).ToList();
            foreach (var motoristaRow in rowsMotoristas)
            {
                var mot = new InfoMotorista();
                mot.Nome = motoristaRow.nome + " " + motoristaRow.sobrenome;
                mot.Id = motoristaRow.id;
                lstMotorista.Add(mot);
            }
            return lstMotorista;
        }
    }
}