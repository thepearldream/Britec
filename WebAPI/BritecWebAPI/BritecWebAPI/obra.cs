//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class obra
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public obra()
        {
            this.fasedaobra = new HashSet<fasedaobra>();
            this.veiculoobra = new HashSet<veiculoobra>();
            this.usuario = new HashSet<usuario>();
        }
    
        public long id { get; set; }
        public string descricao { get; set; }
        public System.DateTime dataInicio { get; set; }
        public System.DateTime dataFimPrevisto { get; set; }
        public Nullable<System.DateTime> dataFim { get; set; }
        public string cliente { get; set; }
        public string local { get; set; }
        public double ValorPorToneladaFrete { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<fasedaobra> fasedaobra { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<veiculoobra> veiculoobra { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<usuario> usuario { get; set; }
    }
}
