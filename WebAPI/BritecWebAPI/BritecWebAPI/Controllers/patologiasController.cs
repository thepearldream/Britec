﻿using System;
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
using BritecWebAPI.Models.Patologia;

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

                    foreach(InfoImagemPatologia pat in parans.patologias)
                    {

                        imagempatologia imgpat = db.imagempatologia.Create();

                        imgpat.patologia = patol;
                        imgpat.latitude = pat.Latitude;
                        imgpat.longitude = pat.Longitude;
                        imgpat.data = pat.Data;
                        imgpat.imagem = Convert.FromBase64String(pat.Imagem);

                        db.imagempatologia.Add(imgpat);
                        db.SaveChanges();

                        pat.Patologia_id = patol.id; 
                    }


                    dbTrans.Commit();

                    ret.sucesso = true;
                    ret.dados = parans.patologias;
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
        public List<InfoPatologia> getListPatologia(parans_getListPatologia parans)
        {
            var lstPatologia = new List<InfoPatologia>();
            var rowsPatologias = db.patologia.Include(p => p.obra).Where(p => p.Obra_id == parans.Obra_id).ToList();
            foreach (var patologiaRow in rowsPatologias)
            {
                var pat = new InfoPatologia();
                pat.Id = patologiaRow.id;
                pat.Obra_id = patologiaRow.Obra_id;
                pat.Observacao = patologiaRow.observacao;
                pat.imagens = new List<InfoImagemPatologia>();
                foreach (imagempatologia imgpatRow in patologiaRow.imagempatologia)
                {
                    var imgpat = new InfoImagemPatologia();
                    imgpat.Data = imgpatRow.data;
                    imgpat.Id = imgpatRow.id;
                    imgpat.Imagem = Convert.ToBase64String(imgpatRow.imagem);
                    imgpat.Latitude = imgpatRow.latitude;
                    imgpat.Longitude = imgpatRow.longitude;
                    imgpat.Patologia_id = imgpatRow.Patologia_id;
                    pat.imagens.Add(imgpat);
                }
                lstPatologia.Add(pat);
            }
            return lstPatologia;
        }

    }
    #region Parâmetros
    public class parans_criaPatologia : ParansInfoUsuario 
    {
        public long Obra_id { get; set; }
        public string Observacao { get; set; }
        public List<InfoImagemPatologia> patologias { get; set; }
    }
    public class parans_getListPatologia
    {
        public long Obra_id { get; set; }
    }
    #endregion
}