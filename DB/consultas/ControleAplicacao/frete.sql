select sum(i.toneladas) as toneladas, avg(i.toneladas) as media, 
	count(*) as viagens, round((o.ValorPorToneladaFrete * sum(i.toneladas)), 2) As valorbruto, m.nome as motorista
from itemaplicacao  i
	inner join fasedaobra f on f.id = i.Fase_id
    inner join obra o on o.id = f.Obra_id
    inner join motorista m on i.Motorista_id = m.id
where i.Fase_id = 1
	and i.data between '2015-10-02 00:00:00' and '2015-10-02 00:00:00'
group by i.Motorista_id
order by m.nome