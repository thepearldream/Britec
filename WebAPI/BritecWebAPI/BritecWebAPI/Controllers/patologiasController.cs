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
using System.Web;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace BritecWebAPI.Controllers
{
    public class patologiasController : ApiController
    {
        private britecEntities db = new britecEntities();

        [HttpPost]
        public StatusRequisicao criaPatologia(parans_criaPatologia parans)
        {
            var ret = new StatusRequisicao();
            using (var dbTrans = db.Database.BeginTransaction())
            {
                try
                {

                    var patol = db.patologia.Create();

                    patol.Obra_id = parans.Obra_id;
                    patol.Usuario_CloudId = parans.usuarioId;
                    patol.observacao = parans.Observacao;

                    db.patologia.Add(patol);
                    db.SaveChanges();
                    dbTrans.Commit();

                    ret.sucesso = true;
                    ret.dados = new { id = patol.id };
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
        public StatusRequisicao criaImagemPatologia(parans_criaImagemPatologia parans)
        {

            
            var resposta = new StatusRequisicao();

            using (var dbTrans = db.Database.BeginTransaction())
            {
                try
                {
                    var pat = db.patologia.Include(p => p.obra).Where(p => p.id == parans.Patologia_id).FirstOrDefault();

                    var diretorio = HttpContext.Current.Server.MapPath("~/") + "imagens\\obras\\" + pat.obra.id + "\\";

                    imagempatologia imgpat = db.imagempatologia.Create();

                    imgpat.patologia = pat;
                    imgpat.latitude = parans.Latitude;
                    imgpat.longitude = parans.Longitude;
                    imgpat.data = parans.Data;
                    imgpat.urlImagem = "";

                    db.imagempatologia.Add(imgpat);
                    db.SaveChanges();

                    byte[] byteArray = Convert.FromBase64String(parans.Imagem);
                    Image result = null;
                    ImageFormat format = ImageFormat.Png;
                    result = new Bitmap(new MemoryStream(byteArray));
                    using (Image imageToExport = result)
                    {
                        (new FileInfo(diretorio)).Directory.Create();
                        imageToExport.Save(diretorio + imgpat.id.ToString() + "." + format.ToString(), format);
                    }

                    imgpat.urlImagem = "imagens/obras/" + pat.obra.id.ToString() + "/" + imgpat.id.ToString() + ".png";

                    db.SaveChanges();
                    dbTrans.Commit();
                    resposta.sucesso = true;
                    resposta.dados = new { id = imgpat.id, urlImagem = imgpat.urlImagem };
                }
                catch (Exception e)
                {
                    dbTrans.Rollback();
                    resposta.sucesso = false;
                    resposta.mensagem = e.Message;
                }

            }

            return resposta;
        }

    }
    #region Parâmetros
    public class parans_criaPatologia : ParansInfoUsuario 
    {
        public long Obra_id { get; set; }
        public string Observacao { get; set; }
    }
    public class parans_criaImagemPatologia
    {
        public long Patologia_id { get; set; }
        public string Imagem { get; set; }
        public DateTime Data { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
    }
    #endregion
}