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
using BritecWebAPI.Models.Abastecimento;

namespace BritecWebAPI.Controllers
{
    public class abastecimentoesController : ApiController
    {
        private britecEntities db = new britecEntities();

        [HttpPost]
        public StatusRequisicao insereAbastecimento(InfoAbastecimento parans)
        {
            var ret = new StatusRequisicao();
            using (var dbTrans = db.Database.BeginTransaction())
            {
                try
                {

                    var VeicObr = db.veiculoobra.Where(vo => vo.Obra_id == parans.Obra_id && vo.Veiculo_id == parans.Veiculo_id).FirstOrDefault();

                    
                    var abs = db.abastecimento.Create();
                    abs.Apontador_CloudId = parans.Usuario_id;
                    abs.data = parans.DataAbastecimento;
                    abs.horimetro = parans.Horimetro;
                    abs.veiculoobra = VeicObr;
                    abs.Observacao = parans.Observacao;
                    abs.quantidade = parans.Quantidade;
                    abs.CategoriaAbastecimento_id = parans.CategoriaAbastecimento_id;
                    db.abastecimento.Add(abs);

                    db.SaveChanges();
                    dbTrans.Commit();

                    ret.sucesso = true;
                    parans.Id = abs.id;
                    parans.DescricaoEquipamento = db.veiculo.Include(v => v.categoriaveiculo).Where(v => v.id == abs.VeiculoObra_Veiculo_id).FirstOrDefault().categoriaveiculo.descricao;
                    parans.Placa = db.veiculo.Where(v => v.id == abs.VeiculoObra_Veiculo_id).FirstOrDefault().placa;
                    ret.dados = parans;
                    return ret;
                }
                catch (Exception e)
                {
                    dbTrans.Rollback();
                    ret.sucesso = false;
                    ret.mensagem = e.Message;
                }
            }
            return ret;
        }

        [HttpPost]
        public List<InfoAbastecimento> getAbastecimentos(parans_getInfoObra parans)
        {
            var lstAbastecimento = new List<InfoAbastecimento>();
            var rowsAbastecimentos = db.abastecimento
                .Include(a => a.veiculoobra.veiculo)
                .Include(a => a.veiculoobra.veiculo.categoriaveiculo)
                .Where(a => a.VeiculoObra_Obra_id == parans.Obra_id)
                .OrderByDescending(a => a.data).ToList();
            foreach (var abastecimentoRow in rowsAbastecimentos)
            {
                var abs = new InfoAbastecimento();
                abs.CategoriaAbastecimento_id = abastecimentoRow.CategoriaAbastecimento_id;
                abs.DataAbastecimento = abastecimentoRow.data;
                abs.DescricaoEquipamento = abastecimentoRow.veiculoobra.veiculo.descricao;
                abs.Horimetro = abastecimentoRow.horimetro;
                abs.Id = abastecimentoRow.id;
                abs.Obra_id = abastecimentoRow.VeiculoObra_Obra_id;
                abs.Observacao = abastecimentoRow.Observacao;
                abs.Placa = abastecimentoRow.veiculoobra.veiculo.placa;
                abs.Quantidade = abastecimentoRow.quantidade;
                abs.Usuario_id = abastecimentoRow.Apontador_CloudId;
                abs.Veiculo_id = abastecimentoRow.VeiculoObra_Veiculo_id;
                lstAbastecimento.Add(abs);
            }
            return lstAbastecimento;
        }

    }
    #region Parâmetros
    
    #endregion
}