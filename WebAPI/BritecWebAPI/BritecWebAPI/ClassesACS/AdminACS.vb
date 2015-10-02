Imports System.Net
Imports Newtonsoft.Json
Imports System.IO
Imports System.Threading
Imports System.Text
Imports System.Web

Public Module AdminACS

    'Chaves do APP no ACS.
    Private ChaveACSCorporativo As String
    Private ChaveACSCliente As String

    'Indica se está em produção ou não.
    Private emProducao As Boolean

    'Cookies container.
    Private Property CCCorporativo As New CookieContainer()
    Private Property CCCliente As New CookieContainer()

    'Indica se se está logado no ACS.
    Private Property statusLoginCorporativo As Boolean = False
    Private Property statusLoginCliente As Boolean = False

    'Indica o número de tentativas de login executadas.
    Private Property contadortentativaCorporativo As Integer = 0
    Private Property contadortentativaCliente As Integer = 0

    'Indica em qual banco de dados do ACS deve ser feita a consulta.
    Public Enum TipoUsuario
        UAU = 0
        Cliente = 1
    End Enum

    ''' <summary>
    ''' Faço login ROOT no ACS para o banco de dados UAU Corporativo.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 03/08/2015
    ''' Projeto    : 183484 - Projeto
    ''' </remarks>
    Public Sub realizaLoginCorporativo()
        Try
            ChaveACSCorporativo = IIf(System.Configuration.ConfigurationManager.AppSettings("emProducao").ToString() = "1",
                                     System.Configuration.ConfigurationManager.AppSettings("APPKeyProdCorporativo").ToString(),
                                     System.Configuration.ConfigurationManager.AppSettings("APPKeyDevCorporativo").ToString())

            emProducao = IIf(System.Configuration.ConfigurationManager.AppSettings("emProducao").ToString() = "1", True, False)

            Dim login As String
            Dim senha As String

            If emProducao Then
                login = System.Configuration.ConfigurationManager.AppSettings("loginAdmProd").ToString()
                senha = System.Configuration.ConfigurationManager.AppSettings("senhaAdmProd").ToString()
            Else
                login = System.Configuration.ConfigurationManager.AppSettings("loginAdmDev").ToString()
                senha = System.Configuration.ConfigurationManager.AppSettings("senhaAdmDev").ToString()
            End If

            Dim status = realizaLogin(ChaveACSCorporativo, login, senha, CCCorporativo)

            If status.sucesso = False Then
                'Tenta novamente
                contadortentativaCorporativo = contadortentativaCorporativo + 1
                Dim t = New Thread(AddressOf TentativaLoginCorporativo)
                t.Start()
            Else
                'Indico que o login foi feito.
                statusLoginCorporativo = True
            End If

        Catch ex As Exception
            Throw
        End Try

    End Sub

    ''' <summary>
    ''' Faço login ROOT no ACS para o banco de dados UAU Cliente.
    ''' </summary>
    ''' <remarks>
    ''' Criação    : Carlos Eduardo Santos Alves Domingos        Data: 03/08/2015
    ''' Projeto    : 183484 - Projeto
    ''' </remarks>
    Public Sub realizaLoginCliente()
        Try
            ChaveACSCliente = IIf(System.Configuration.ConfigurationManager.AppSettings("emProducao").ToString() = "1",
                                     System.Configuration.ConfigurationManager.AppSettings("APPKeyProdCliente").ToString(),
                                     System.Configuration.ConfigurationManager.AppSettings("APPKeyDevCliente").ToString())

            emProducao = IIf(System.Configuration.ConfigurationManager.AppSettings("emProducao").ToString() = "1", True, False)

            Dim login As String
            Dim senha As String

            If emProducao Then
                login = System.Configuration.ConfigurationManager.AppSettings("loginAdmProd").ToString()
                senha = System.Configuration.ConfigurationManager.AppSettings("senhaAdmProd").ToString()
            Else
                login = System.Configuration.ConfigurationManager.AppSettings("loginAdmDev").ToString()
                senha = System.Configuration.ConfigurationManager.AppSettings("senhaAdmDev").ToString()
            End If

            Dim status = realizaLogin(ChaveACSCliente, login, senha, CCCliente)

            If status.sucesso = False Then
                'Tenta novamente
                contadortentativaCliente = contadortentativaCliente + 1
                Dim t = New Thread(AddressOf TentativaLoginCliente)
                t.Start()
            Else
                'Indico que o login foi feito.
                statusLoginCliente = True
            End If

        Catch ex As Exception
            Throw
        End Try

    End Sub

    Private Function realizaLogin(ByVal ChaveACS As String, ByVal loginACS As String, ByVal senhaACS As String, ByRef CC As CookieContainer) As RespostaMob

        Try

            'Url de login no ACS. 
            Dim request As HttpWebRequest = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/users/login.json?key=" & ChaveACS & "&pretty_json=true")
            'O método de login é POST de acordo a documentação da appcelerator.
            request.Method = "POST"
            'Seto o cookie container para manter o valor da sessão.
            request.CookieContainer = CC
            'Serializo os dados do login em um json.
            Dim info As New ParansLogin()
            info.login = loginACS
            info.password = senhaACS
            Dim postData As String = JsonConvert.SerializeObject(info)
            Dim byteArray As Byte() = Encoding.UTF8.GetBytes(postData)
            ' Seto o ContentType para json, já que os dados no POST estão no formato JSON.
            request.ContentType = "application/json"

            'Preparo os dados
            request.ContentLength = byteArray.Length
            Dim dataStream As Stream = request.GetRequestStream()
            dataStream.Write(byteArray, 0, byteArray.Length)
            dataStream.Close()

            'Obtenho a resposta da requisição
            Dim response As HttpWebResponse = request.GetResponse()
            response.Close()

            'Retorno sucesso
            Dim ret As New RespostaMob()
            ret.sucesso = True
            Return ret

        Catch ex As WebException
            Dim ret As New RespostaMob()
            If ex.Status = WebExceptionStatus.ProtocolError Then
                ret.sucesso = False
                ret.mensagem = "Erro de protocolo;Cod-1"
                Return ret
            ElseIf ex.Status = WebExceptionStatus.Timeout Then
                ret.sucesso = False
                ret.mensagem = "Time out;Cod-2"
                Return ret
            Else
                ret.sucesso = False
                ret.mensagem = "Desconhecido;Cod-3"
                Return ret
            End If
            Throw
        Catch ex As Exception
            Throw
        End Try
    End Function

    Private Sub TentativaLoginCorporativo()
        Thread.Sleep(60000)
        realizaLoginCorporativo()
    End Sub

    Private Sub TentativaLoginCliente()
        Thread.Sleep(60000)
        realizaLoginCliente()
    End Sub

    Public Function EnviarNotificacao(ByVal canal As String, ByVal Dados As Object, ByVal TUser As TipoUsuario, ByVal TokenEmpresa As String,
                                      Optional ByVal clientes As String = "everyone", Optional ByVal Mensagem As String = "", Optional ByVal Servico As String = "") As rootACSResponseNotificacao
        Try
            Dim resposta As New rootACSResponseNotificacao()
            'Verifico se o admin está logado.
            checkLogin(resposta, TUser)
            'Se não estiver retorno o código de erro -1.
            If resposta.meta.code <> 0 Then
                Return resposta
            End If

            Dim request As HttpWebRequest

            If TUser = TipoUsuario.UAU Then
                'Url de notificação no ACS. 
                request = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/push_notification/notify.json?key=" & ChaveACSCorporativo)
                'Seto o cookie container para manter o valor da sessão.
                request.CookieContainer = CCCorporativo
            Else
                'Url de notificação no ACS. 
                request = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/push_notification/notify.json?key=" & ChaveACSCliente)
                'Seto o cookie container para manter o valor da sessão.
                request.CookieContainer = CCCliente
            End If

            'O método de notificação é POST de acordo a documentação da appcelerator.
            request.Method = "POST"

            'Serializo os dados da notificacao em um json.
            Dim info As New ParametrosNotificacao()
            'Seto o canal da notificação.
            info.channel = canal & "_" & TokenEmpresa
            info.options = New OptionsNotificacao()
            'A notificação expira após 1 dia.
            info.options.expire_after_seconds = 86400
            'Envio os dados para os usuários selecionados, por padrão envia para todo mundo.
            info.to_ids = clientes
            'Monto os dados de  configuração da notificação.
            Dim payload = New PayLoad()
            payload.alert = Mensagem
            payload.dados = Dados
            payload.mensagem = Mensagem
            If Servico <> "" Then
                payload.servico = Servico
            End If
            payload.title = IIf(TUser = TipoUsuario.UAU, "UAU Corporativo", "UAU Cliente")

            info.payload = payload

            Dim postData As String = JsonConvert.SerializeObject(info)
            Dim byteArray As Byte() = Encoding.UTF8.GetBytes(postData)
            ' Seto o ContentType para json, já que os dados no POST estão no formato JSON.
            request.ContentType = "application/json"

            'Preparo os dados
            request.ContentLength = byteArray.Length
            Dim dataStream As Stream = request.GetRequestStream()
            dataStream.Write(byteArray, 0, byteArray.Length)
            dataStream.Close()

            'Obtenho a resposta da requisição
            Dim response As HttpWebResponse = request.GetResponse()

            dataStream = response.GetResponseStream()
            Dim reader As New StreamReader(dataStream)
            'Leio a resposta.
            Dim responseFromServer As String = reader.ReadToEnd()
            'Deserializo a resposta.
            resposta = JsonConvert.DeserializeObject(Of rootACSResponseNotificacao)(responseFromServer)
            'Fecho os streans.
            reader.Close()
            dataStream.Close()
            response.Close()

            'Retorno a resposta do serviço
            Return resposta
        Catch ex As WebException
            Dim resposta As New rootACSResponseNotificacao()
            If ex.Status = WebExceptionStatus.ProtocolError Then
                MontaException400(resposta)
            Else
                MontaExceptionDesconhecido(resposta)
            End If
            Return resposta
        Catch ex As Exception
            Throw
        End Try

    End Function

    Private Sub checkLogin(ByRef root As rootACSResponse, ByRef TUser As TipoUsuario)
        root.meta = New InfoBasicoACS()
        root.meta.code = -1
        root.meta.method_name = "checkLogin"
        root.meta.status = "Fail"

        If TUser = TipoUsuario.UAU Then
            If Not statusLoginCorporativo Then
                contadortentativaCorporativo = contadortentativaCorporativo + 1
                Dim t = New Thread(AddressOf TentativaLoginCorporativo)
                t.Start()
            Else
                root.meta.code = 0
                root.meta.status = "OK"
            End If
        Else
            If Not statusLoginCliente Then
                contadortentativaCliente = contadortentativaCliente + 1
                Dim t = New Thread(AddressOf TentativaLoginCliente)
                t.Start()
            Else
                root.meta.code = 0
                root.meta.status = "OK"
            End If
        End If


    End Sub

    Public Function GetUserId(ByVal CodUsuario As String, ByVal TokenEmpresa As String, ByVal TUser As TipoUsuario) As rootACSResponseUsuario
        Try
            Dim resposta As New rootACSResponseUsuario()
            'Verifico se o admin está logado.
            checkLogin(resposta, TUser)
            'Se não estiver retorno o código de erro -1.
            If resposta.meta.code <> 0 Then
                Return resposta
            End If

            'Seto o tipo de usuário
            Dim loginCliente
            Dim request As HttpWebRequest
            If TUser = TipoUsuario.UAU Then
                loginCliente = LCase(TokenEmpresa) & "_" & CodUsuario & "_uau"
                'Url de busca de usuário no ACS. 
                request = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/users/query.json?key=" & ChaveACSCorporativo & "&pretty_json=true" & "&where={""username"":""" & HttpUtility.UrlEncode(loginCliente) & """}")
                'Seto o cookie container para manter o valor da sessão.
                request.CookieContainer = CCCorporativo
            Else
                loginCliente = LCase(TokenEmpresa) & "_" & CodUsuario & "_cliente"
                'Url de busca de usuário no ACS. 
                request = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/users/query.json?key=" & ChaveACSCliente & "&pretty_json=true" & "&where={""username"":""" & HttpUtility.UrlEncode(loginCliente) & """}")
                'Seto o cookie container para manter o valor da sessão.
                request.CookieContainer = CCCliente
            End If

            'O método de busca é GET de acordo a documentação da appcelerator.
            request.Method = "GET"

            ' Seto o ContentType para json, já que os dados no POST estão no formato JSON.
            request.ContentType = "application/json"

            'Obtenho a resposta da requisição
            Dim response As HttpWebResponse = request.GetResponse()

            Dim dataStream As Stream
            dataStream = response.GetResponseStream()
            Dim reader As New StreamReader(dataStream)
            'Leio a resposta.
            Dim responseFromServer As String = reader.ReadToEnd()
            'Deserializo a resposta.
            resposta = JsonConvert.DeserializeObject(Of rootACSResponseUsuario)(responseFromServer)
            'Fecho os streans.
            reader.Close()
            dataStream.Close()
            response.Close()

            'Devolvo o Id do usuário da resposta.
            Return resposta
        Catch ex As WebException
            Dim resposta As New rootACSResponseUsuario()
            If ex.Status = WebExceptionStatus.ProtocolError Then
                MontaException400(resposta)
            Else
                MontaExceptionDesconhecido(resposta)
            End If
            Return resposta
        Catch ex As Exception
            Throw
        End Try
    End Function

    Public Function getUsuariosEmpresa(ByVal tokenEmpresa As String, ByVal TUser As TipoUsuario) As rootACSResponseUsuario
        Try
            Dim resposta As New rootACSResponseUsuario()
            'Verifico se o admin está logado.
            checkLogin(resposta, TUser)
            'Se não estiver retorno o código de erro -1.
            If resposta.meta.code <> 0 Then
                Return resposta
            End If

            'Seto o tipo de usuário
            Dim empresa
            Dim request As HttpWebRequest
            If TUser = TipoUsuario.UAU Then
                empresa = LCase(tokenEmpresa)
                'Url de busca de usuário no ACS. 
                request = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/users/query.json?key=" & ChaveACSCorporativo & "&pretty_json=true" & "&where={""username"": {""$regex"":""^" & HttpUtility.UrlEncode(empresa) & "*""}}")
                'Seto o cookie container para manter o valor da sessão.
                request.CookieContainer = CCCorporativo
            Else
                empresa = LCase(tokenEmpresa)
                'Url de busca de usuário no ACS. 
                request = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/users/query.json?key=" & ChaveACSCliente & "&pretty_json=true" & "&where={""username"": {""$regex"":""^" & HttpUtility.UrlEncode(empresa) & "*""}}")
                'Seto o cookie container para manter o valor da sessão.
                request.CookieContainer = CCCliente
            End If

            'O método de busca é GET de acordo a documentação da appcelerator.
            request.Method = "GET"

            ' Seto o ContentType para json, já que os dados no POST estão no formato JSON.
            request.ContentType = "application/json"

            'Obtenho a resposta da requisição
            Dim response As HttpWebResponse = request.GetResponse()

            Dim dataStream As Stream
            dataStream = response.GetResponseStream()
            Dim reader As New StreamReader(dataStream)
            'Leio a resposta.
            Dim responseFromServer As String = reader.ReadToEnd()
            'Deserializo a resposta.
            resposta = JsonConvert.DeserializeObject(Of rootACSResponseUsuario)(responseFromServer)
            'Fecho os streans.
            reader.Close()
            dataStream.Close()
            response.Close()

            'Devolvo o Id do usuário da resposta.
            Return resposta
        Catch ex As WebException
            Dim resposta As New rootACSResponseUsuario()
            If ex.Status = WebExceptionStatus.ProtocolError Then
                MontaException400(resposta)
            Else
                MontaExceptionDesconhecido(resposta)
            End If
            Return resposta
        Catch ex As Exception
            Throw
        End Try
    End Function

    Public Function DeleteUser(ByVal idUsuario As String, ByVal TUser As TipoUsuario) As rootACSResponseUsuario
        Try
            Dim resposta As New rootACSResponseUsuario()
            'Verifico se o admin está logado.
            checkLogin(resposta, TUser)
            'Se não estiver retorno o código de erro -1.
            If resposta.meta.code <> 0 Then
                Return resposta
            End If

            Dim request As HttpWebRequest

            If TUser = TipoUsuario.UAU Then
                'Url de busca de usuário no ACS. 
                request = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/users/delete.json?key=" & ChaveACSCorporativo & "&pretty_json=true" & "&su_id=" & idUsuario)

                'Seto o cookie container para manter o valor da sessão.
                request.CookieContainer = CCCorporativo
            Else
                'Url de busca de usuário no ACS. 
                request = HttpWebRequest.Create("https://api.cloud.appcelerator.com/v1/users/delete.json?key=" & ChaveACSCliente & "&pretty_json=true" & "&su_id=" & idUsuario)

                'Seto o cookie container para manter o valor da sessão.
                request.CookieContainer = CCCliente
            End If

            'O método de busca é GET de acordo a documentação da appcelerator.
            request.Method = "GET"

            ' Seto o ContentType para json, já que os dados no POST estão no formato JSON.
            request.ContentType = "application/json"

            'Obtenho a resposta da requisição
            Dim response As HttpWebResponse = request.GetResponse()

            Dim dataStream As Stream
            dataStream = response.GetResponseStream()
            Dim reader As New StreamReader(dataStream)
            'Leio a resposta.
            Dim responseFromServer As String = reader.ReadToEnd()
            'Deserializo a resposta.
            resposta = JsonConvert.DeserializeObject(Of rootACSResponseUsuario)(responseFromServer)
            'Fecho os streans.
            reader.Close()
            dataStream.Close()
            response.Close()

            'Devolvo o Id do usuário da resposta.
            Return resposta
        Catch ex As WebException
            Dim resposta As New rootACSResponseUsuario()
            If ex.Status = WebExceptionStatus.ProtocolError Then
                MontaException400(resposta)
            Else
                MontaExceptionDesconhecido(resposta)
            End If
            Return resposta
        Catch ex As Exception
            Throw
        End Try
    End Function

    Private Sub MontaException400(ByRef resposta As rootACSResponse)
        resposta.meta = New InfoBasicoACS()
        resposta.meta.code = -2
        resposta.meta.status = "Fail"
        resposta.meta.method_name = "Exception400"
    End Sub

    Private Sub MontaExceptionDesconhecido(ByRef resposta As rootACSResponse)
        resposta.meta = New InfoBasicoACS()
        resposta.meta.code = -3
        resposta.meta.status = "Fail"
        resposta.meta.method_name = "Desconhecido"
    End Sub

#Region "Classes de mapeamento"
    Private Class ParansLogin
        Public Property login As String
        Public Property password As String
    End Class
    Private Class Parametrosbasicos
        Public Property limit As Integer
        Public Property skip As Integer
        Public Property sel As String
    End Class
    Public MustInherit Class rootACSResponse
        Public Property meta As InfoBasicoACS
    End Class
    Public Class InfoBasicoACS
        Public Property code As Integer
        Public Property status As String
        Public Property method_name As String
    End Class
    Public Class rootACSResponseUsuario
        Inherits rootACSResponse
        Public Property response As User
    End Class
    Public Class User
        Public Property users As List(Of InfoUsuario)
    End Class
    Public Class InfoUsuario
        Public Property id As String
        Public Property first_name As String
        Public Property last_name As String
        Public Property created_at As DateTime
        Public Property updated_at As DateTime
        Public Property confirmed_at As DateTime
        Public Property username As String
        Public Property email As String
        Public Property admin As Boolean
    End Class
    Public Class rootACSResponseNotificacao
        Inherits rootACSResponse
        Public Property response As PayLoad
    End Class
    Private Class ParametrosNotificacao
        Public Property channel As String
        Public Property to_ids As String
        Public Property payload As PayLoad
        Public Property options As OptionsNotificacao
        Public Property pretty_json As Boolean = True
    End Class
    Public Class PayLoad
        Public Property alert As String
        Public Property icon As String = "icone"
        Public Property sound As String = "default"
        Public Property title As String
        Public Property vibrate As String = "true"
        Public Property servico As String = "mensagem"
        Public Property mensagem As String
        Public Property dados As Object
    End Class
    Private Class OptionsNotificacao
        Public Property expire_after_seconds As Long
    End Class
#End Region

End Module
