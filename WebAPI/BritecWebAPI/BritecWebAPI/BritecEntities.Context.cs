﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BritecWebAPI
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class britecEntities : DbContext
    {
        public britecEntities()
            : base("name=britecEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<abastecimento> abastecimento { get; set; }
        public virtual DbSet<categoriaabastecimento> categoriaabastecimento { get; set; }
        public virtual DbSet<categoriaveiculo> categoriaveiculo { get; set; }
        public virtual DbSet<controleaplicacaomassa> controleaplicacaomassa { get; set; }
        public virtual DbSet<fasedaobra> fasedaobra { get; set; }
        public virtual DbSet<funcao> funcao { get; set; }
        public virtual DbSet<funcaoprograma> funcaoprograma { get; set; }
        public virtual DbSet<itemaplicacao> itemaplicacao { get; set; }
        public virtual DbSet<motorista> motorista { get; set; }
        public virtual DbSet<nivelpermissao> nivelpermissao { get; set; }
        public virtual DbSet<obra> obra { get; set; }
        public virtual DbSet<programa> programa { get; set; }
        public virtual DbSet<proprietario> proprietario { get; set; }
        public virtual DbSet<usuario> usuario { get; set; }
        public virtual DbSet<veiculo> veiculo { get; set; }
        public virtual DbSet<veiculoobra> veiculoobra { get; set; }
        public virtual DbSet<imagempatologia> imagempatologia { get; set; }
        public virtual DbSet<patologia> patologia { get; set; }
    }
}
