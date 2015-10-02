using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using BritecWebAPI;
using BritecWebAPI.Models;

namespace BritecWebAPI.Controllers
{
    public class veiculoesController : ApiController
    {
        private britecEntities db = new britecEntities();

        [HttpPost]
        public List<InfoVeiculo> getVeiculos()
        {
            var lstVeiculos = new List<InfoVeiculo>();
            var rowsVeiculos = db.veiculo.OrderBy(v => v.placa).ToList();
            foreach (var veiculoRow in rowsVeiculos)
            {
                var veic = new InfoVeiculo();
                veic.PlacaDescricao = veiculoRow.placa + " - " + veiculoRow.descricao;
                veic.Id = veiculoRow.id;
                lstVeiculos.Add(veic);
            }
            return lstVeiculos;
        }

    }
}