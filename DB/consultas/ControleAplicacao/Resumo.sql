select round(sum(i.toneladas), 2) as CargaAcumulada, avg(i.espessura) as EspessuraMedia, 
	round(sum(i.comprimento * i.largura), 2) As AreaTotal, 
    count(*) as QuantidadeCaminhoes, avg(o.ValorPorToneladaFrete) as ValorTonelada, 
    round(sum(i.toneladas) * avg(o.ValorPorToneladaFrete), 2) As ValorTotalBrutoFrete
from itemaplicacao  i
	inner join fasedaobra f on f.id = i.Fase_id
    inner join obra o on o.id = f.Obra_id
    inner join motorista m on i.Motorista_id = m.id
where i.Fase_id = 1
	and i.data between '2015-10-02 00:00:00' and '2015-10-02 00:00:00'