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
    
    public partial class patologia
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public patologia()
        {
            this.imagempatologia = new HashSet<imagempatologia>();
        }
    
        public long id { get; set; }
        public string observacao { get; set; }
        public long Obra_id { get; set; }
        public string Usuario_CloudId { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<imagempatologia> imagempatologia { get; set; }
        public virtual obra obra { get; set; }
        public virtual usuario usuario { get; set; }
    }
}