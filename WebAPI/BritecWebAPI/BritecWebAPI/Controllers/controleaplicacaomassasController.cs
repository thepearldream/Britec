using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using BritecWebAPI.Models;
using System.Text;
using MySql.Data.MySqlClient;
using BritecWebAPI.Models.ControleAplicacao;

namespace BritecWebAPI.Controllers
{
    public class controleaplicacaomassasController : ApiController
    {
        private britecEntities db = new britecEntities();

        
        [HttpPost]
        public StatusRequisicao inserirAplicacao(AplicacaoMassa parans)
        {
            var ret = new StatusRequisicao();
            using (var dbTrans = db.Database.BeginTransaction())
            {
                try
                {
                    var controleAplicacao = db.controleaplicacaomassa
                        .Where(cam => cam.Apontador_CloudId == parans.usuarioId && cam.data == parans.data && cam.Fase_id == parans.Fase_id).FirstOrDefault();
                    if (controleAplicacao == null)
                    {
                        controleAplicacao = db.controleaplicacaomassa.Create();
                        controleAplicacao.Fase_id = parans.Fase_id;
                        controleAplicacao.data = parans.data;
                        controleAplicacao.Apontador_CloudId = parans.usuarioId;
                        db.controleaplicacaomassa.Add(controleAplicacao);
                        db.SaveChanges();
                    }

                    var aplic = db.itemaplicacao.Create();
                    aplic.Apontador_CloudId = parans.usuarioId;
                    aplic.comprimento = parans.Comprimento;
                    aplic.controleaplicacaomassa = controleAplicacao;
                    aplic.espessura = parans.Espessura;
                    aplic.estaca = parans.Estaca;
                    aplic.horaFim = parans.HoraFim;
                    aplic.horaInicio = parans.HoraInicio;
                    aplic.largura = parans.Largura;
                    aplic.Motorista_id = parans.Motorista_id;
                    aplic.nota = parans.Nota;
                    aplic.temperatura = parans.Temperatura;
                    aplic.toneladas = parans.Toneladas;
                    aplic.Veiculo_id = parans.Veiculo_id;

                    db.itemaplicacao.Add(aplic);
                    db.SaveChanges();
                    dbTrans.Commit();

                    ret.sucesso = true;
                    parans.id = aplic.id;
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
        public List<Frete> getListFrete(parans_getListItensObra parans)
        {
            var lstFrete = new List<Frete>();
            StringBuilder consultaSQL = new StringBuilder();
            consultaSQL.AppendLine("select sum(i.toneladas) as Toneladas, round(avg(i.toneladas), 2) as MediaToneladasViagem, ");
            consultaSQL.AppendLine("	count(*) as Viagens, round((o.ValorPorToneladaFrete * sum(i.toneladas)), 2) As ValorBruto, CONCAT(CONCAT(m.nome, ' '), m.sobrenome) as Motorista ");
            consultaSQL.AppendLine("from itemaplicacao  i ");
            consultaSQL.AppendLine("	inner join fasedaobra f on f.id = i.Fase_id ");
            consultaSQL.AppendLine("    inner join obra o on o.id = f.Obra_id ");
            consultaSQL.AppendLine("    inner join motorista m on i.Motorista_id = m.id ");
            consultaSQL.AppendLine("where ");
            if (parans.Fase_id != null)
            {
                consultaSQL.AppendLine("    i.Fase_id = @fase_id and ");
            }
            consultaSQL.AppendLine("    i.data between @periodoinicial and @periodofinal and f.Obra_id = @obra_id ");
            consultaSQL.AppendLine("group by i.Motorista_id ");
            consultaSQL.AppendLine("order by m.nome");

            List<Frete> rowsFrete = db.Database.SqlQuery<Frete>(consultaSQL.ToString(), new MySqlParameter("@fase_id", parans.Fase_id), 
                        new MySqlParameter("@periodoinicial", parans.PeriodoInicial.ToString("yyyy-MM-dd HH:mm:ss")), 
                        new MySqlParameter("@periodofinal", parans.PeriodoFinal.ToString("yyyy-MM-dd HH:mm:ss")),
                        new MySqlParameter("@obra_id", parans.Obra_id))
                .ToList();

            return rowsFrete;
        }

        [HttpPost]
        public List<Resumo> getResumo(parans_getListItensObra parans)
        {
            var lstResumo = new List<Resumo>();
            StringBuilder consultaSQL = new StringBuilder();
            consultaSQL.AppendLine("select COALESCE(round(sum(i.toneladas), 2), 0) as CargaAcumulada, COALESCE(round(avg(i.espessura), 2), 0) as EspessuraMedia, ");
            consultaSQL.AppendLine("	COALESCE(round(sum(i.comprimento * i.largura), 2), 0) As AreaTotal, ");
            consultaSQL.AppendLine("    count(*) as QuantidadeCaminhoes, COALESCE(avg(o.ValorPorToneladaFrete), 0) as ValorTonelada, ");
            consultaSQL.AppendLine("    COALESCE(round(sum(i.toneladas) * avg(o.ValorPorToneladaFrete), 2), 0) As ValorTotalBrutoFrete ");
            consultaSQL.AppendLine("from itemaplicacao  i ");
            consultaSQL.AppendLine("	inner join fasedaobra f on f.id = i.Fase_id ");
            consultaSQL.AppendLine("    inner join obra o on o.id = f.Obra_id ");
            consultaSQL.AppendLine("where ");
            if(parans.Fase_id != null)
            {
                consultaSQL.AppendLine("    i.Fase_id = @fase_id and ");
            }
            consultaSQL.AppendLine("    i.data between @periodoinicial and @periodofinal and f.Obra_id = @obra_id ");

            List<Resumo> rowsResumo = db.Database.SqlQuery<Resumo>(consultaSQL.ToString(), new MySqlParameter("@fase_id", parans.Fase_id),
                        new MySqlParameter("@periodoinicial", parans.PeriodoInicial.ToString("yyyy-MM-dd HH:mm:ss")),
                        new MySqlParameter("@periodofinal", parans.PeriodoFinal.ToString("yyyy-MM-dd HH:mm:ss")),
                        new MySqlParameter("@obra_id", parans.Obra_id))
                .ToList();

            return rowsResumo;
        }

        [HttpPost]
        public List<AplicacaoMassa> getListAplicacao(parans_getListItensObra parans)
        {
            var lstAplicacao = new List<AplicacaoMassa>();

            List<itemaplicacao> aplicacaoRows = null;
            aplicacaoRows = db.itemaplicacao.Where(ia => 
                (parans.PeriodoFinal!=DateTime.MinValue?ia.data <= parans.PeriodoFinal:true) 
                && (parans.PeriodoInicial!= DateTime.MinValue ? ia.data >= parans.PeriodoInicial:true) 
                && (parans.Fase_id!=null?ia.Fase_id == parans.Fase_id:true)
            ).ToList();
            
            foreach(var aplicacaoRow in aplicacaoRows)
            {
                var apl = new AplicacaoMassa();
                apl.Comprimento = aplicacaoRow.comprimento;
                apl.data = aplicacaoRow.data;
                apl.Espessura = aplicacaoRow.espessura;
                apl.Estaca = aplicacaoRow.estaca;
                apl.Fase_id = aplicacaoRow.Fase_id;
                apl.HoraFim = aplicacaoRow.horaFim;
                apl.HoraInicio = aplicacaoRow.horaInicio;
                apl.id = aplicacaoRow.id;
                apl.Largura = aplicacaoRow.largura;
                apl.Motorista_id = aplicacaoRow.Motorista_id;
                apl.Nota = aplicacaoRow.nota;
                apl.Temperatura = aplicacaoRow.temperatura;
                apl.Toneladas = aplicacaoRow.toneladas;
                apl.usuarioId = aplicacaoRow.Apontador_CloudId;
                apl.Veiculo_id = aplicacaoRow.Veiculo_id;
                lstAplicacao.Add(apl);
            }

            return lstAplicacao;
        }

    }
    #region Parâmetros
    public class parans_getListItensObra
    {
        public DateTime PeriodoInicial { get; set; }
        public DateTime PeriodoFinal { get; set; }
        public long Obra_id { get; set; }
        public Nullable<long> Fase_id { get; set; }
    }
    #endregion
}