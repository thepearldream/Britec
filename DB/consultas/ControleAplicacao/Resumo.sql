select COALESCE(round(sum(i.toneladas), 2), 0) as CargaAcumulada, COALESCE(avg(i.espessura), 0) as EspessuraMedia, 
	COALESCE(round(sum(i.comprimento * i.largura), 2), 0) As AreaTotal, 
    count(*) as QuantidadeCaminhoes, COALESCE(avg(o.ValorPorToneladaFrete), 0) as ValorTonelada, 
    COALESCE(round(sum(i.toneladas) * avg(o.ValorPorToneladaFrete), 2), 0) As ValorTotalBrutoFrete
from itemaplicacao  i
	inner join fasedaobra f on f.id = i.Fase_id
    inner join obra o on o.id = f.Obra_id
    inner join motorista m on i.Motorista_id = m.id
where 
	i.data between '2015-10-08 00:00:00' and '2015-10-08 00:00:00'