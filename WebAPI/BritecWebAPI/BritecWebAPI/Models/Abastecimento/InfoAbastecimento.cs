using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BritecWebAPI.Models.Abastecimento
{
    public class InfoAbastecimento
    {
        public Nullable<long> Id { get; set; }
        public string Usuario_id { get; set; }
        public DateTime DataAbastecimento { get; set; }
        public long Veiculo_id { get; set; }
        public long Obra_id { get; set; }
        public double Horimetro { get; set; }
        public double Quantidade { get; set; }
        public int CategoriaAbastecimento_id { get; set; }
        public string Observacao { get; set; }
        public string DescricaoEquipamento { get; set; }
        public string Placa { get; set; }
    }
}