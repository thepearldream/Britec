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

namespace BritecWebAPI.Controllers
{
    public class categoriaveiculoesController : ApiController
    {
        private britecEntities db = new britecEntities();

        // GET: api/categoriaveiculoes
        public IQueryable<categoriaveiculo> Getcategoriaveiculo()
        {
            return db.categoriaveiculo;
        }

        // GET: api/categoriaveiculoes/5
        [ResponseType(typeof(categoriaveiculo))]
        public IHttpActionResult Getcategoriaveiculo(int id)
        {
            categoriaveiculo categoriaveiculo = db.categoriaveiculo.Find(id);
            if (categoriaveiculo == null)
            {
                return NotFound();
            }

            return Ok(categoriaveiculo);
        }

        // PUT: api/categoriaveiculoes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult Putcategoriaveiculo(int id, categoriaveiculo categoriaveiculo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != categoriaveiculo.id)
            {
                return BadRequest();
            }

            db.Entry(categoriaveiculo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!categoriaveiculoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/categoriaveiculoes
        [ResponseType(typeof(categoriaveiculo))]
        public IHttpActionResult Postcategoriaveiculo(categoriaveiculo categoriaveiculo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.categoriaveiculo.Add(categoriaveiculo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = categoriaveiculo.id }, categoriaveiculo);
        }

        // DELETE: api/categoriaveiculoes/5
        [ResponseType(typeof(categoriaveiculo))]
        public IHttpActionResult Deletecategoriaveiculo(int id)
        {
            categoriaveiculo categoriaveiculo = db.categoriaveiculo.Find(id);
            if (categoriaveiculo == null)
            {
                return NotFound();
            }

            db.categoriaveiculo.Remove(categoriaveiculo);
            db.SaveChanges();

            return Ok(categoriaveiculo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool categoriaveiculoExists(int id)
        {
            return db.categoriaveiculo.Count(e => e.id == id) > 0;
        }
    }
}