using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using BritecWebAPI.Models;
using BritecWebAPI.Models.Obra;

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
        public List<InfoFaseDaObra> getFasesDaObra(parans_getInfoObra parans)
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

        [HttpPost]
        public List<InfoVeiculoObra> getVeiculosObra(parans_getInfoObra parans)
        {
            var lstVeiculoObra = new List<InfoVeiculoObra>();
            var rowsVeiculoObra = db.veiculoobra.Include(vo => vo.veiculo).Where(vo => vo.Obra_id == parans.Obra_id).OrderBy(vo => vo.veiculo.descricao).ToList();
            foreach (var veiculoobraRow in rowsVeiculoObra)
            {
                var veiculo = new InfoVeiculoObra();
                
                lstVeiculoObra.Add(veiculo);
            }
            return lstVeiculoObra;
        }

    }
#region Parâmetros
    public class parans_getInfoObra
    {
        public long Obra_id { get; set; }
    }
#endregion

}