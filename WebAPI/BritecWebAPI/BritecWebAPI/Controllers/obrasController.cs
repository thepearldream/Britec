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
    public class obrasController : ApiController
    {
        private britecEntities db = new britecEntities();

        [HttpPost]
        public List<Obra> getObrasUsuario(ParansInfoUsuario parans)
        {
            var lstObras = new List<Obra>();
            var rowsObras = db.obra.Where(o => o.usuario.Contains(db.usuario.Where(u => u.CloudId == parans.usuarioId).FirstOrDefault()) == true).OrderBy(o => o.descricao).ToList();
            foreach (var obraRow in rowsObras)
            {
                var ob = new Obra();
                ob.cliente = obraRow.cliente;
                ob.dataFim = obraRow.dataFim;
                ob.dataFimPrevisto = obraRow.dataFimPrevisto;
                ob.dataInicio = obraRow.dataInicio;
                ob.descricao = obraRow.descricao;
                ob.id = obraRow.id;
                ob.local = obraRow.local;
                ob.valorFrete = obraRow.ValorPorToneladaFrete;
                lstObras.Add(ob);
            }
            return lstObras;
        }

        [HttpPost]
        public List<InfoFaseDaObra> getFasesDaObra(parans_getFasesDaObra parans)
        {
            var lstFaseObra = new List<InfoFaseDaObra>();
            var rowsFaseObra = db.fasedaobra.Where(fo => fo.Obra_id == parans.Obra_id).OrderBy(fo => fo.descricao).ToList();
            foreach (var faseObraRow in rowsFaseObra)
            {
                var faseOb = new InfoFaseDaObra();
                faseOb.Descricao = faseObraRow.descricao;
                faseOb.Id = faseObraRow.id;
                lstFaseObra.Add(faseOb);
            }   
            return lstFaseObra;
        }

    }
#region "Parâmetros"
    public class parans_getFasesDaObra
    {
        public long Obra_id { get; set; }
    }
#endregion

}