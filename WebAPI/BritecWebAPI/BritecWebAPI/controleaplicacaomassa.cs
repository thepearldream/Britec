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
    
    public partial class controleaplicacaomassa
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public controleaplicacaomassa()
        {
            this.itemaplicacao = new HashSet<itemaplicacao>();
        }
    
        public long id { get; set; }
        public System.DateTime data { get; set; }
        public double toneladasPrevisao { get; set; }
        public string Apontador_CloudId { get; set; }
        public long Trecho_id { get; set; }
    
        public virtual fasedaobra fasedaobra { get; set; }
        public virtual usuario usuario { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<itemaplicacao> itemaplicacao { get; set; }
    }
}
