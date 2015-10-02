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
    public class funcaoprogramasController : ApiController
    {
        private britecEntities db = new britecEntities();

        [HttpPost]
        public List<Permissao> getPermissaoUsuario(ParansInfoUsuario parans)
        {
            var lstPermissao = new List<Permissao>();
            var rowsPerm = db.funcaoprograma.Include(fp => fp.programa).Include(fp => fp.nivelpermissao)
                .Where(fp => db.usuario.Where(u => u.CloudId == parans.usuarioId).FirstOrDefault().Funcao_id == fp.Funcao_id)
                .ToList();
            foreach (var permRow in rowsPerm)
            {
                var perm = new Permissao();
                perm.nivel = permRow.nivelpermissao.valor;
                perm.programa = permRow.programa.descricao;
                lstPermissao.Add(perm);
            }
            return lstPermissao;
        }
    }
}