import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, User, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface InviteData {
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

export const Invite: React.FC = () => {
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Extrair dados do convite da URL
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        setInviteData(decodedData);
      } catch (error) {
        setError('Link de convite inválido');
      }
    } else {
      setError('Link de convite inválido');
    }
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!inviteData) {
      setError('Dados do convite não encontrados');
      setIsLoading(false);
      return;
    }

    // Validações
    if (!password || password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    try {
      // Criar usuário no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: inviteData.email,
        password: password,
        options: {
          data: {
            name: inviteData.name,
            role: inviteData.role,
            department: inviteData.department
          }
        }
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Atualizar usuário na tabela users com o ID do Auth e status ativo
        const { error: updateError } = await supabase
          .from('users')
          .update({
            id: data.user.id,
            status: 'Ativo',
            updated_at: new Date().toISOString()
          })
          .eq('email', inviteData.email);

        if (updateError) {
          console.error('Erro ao atualizar usuário:', updateError);
        }

        setIsSuccess(true);
        toast.success('Conta criada com sucesso! Verifique seu e-mail para confirmar.');
      }

    } catch (error) {
      setError('Erro ao criar conta');
      toast.error('Erro ao criar conta');
    } finally {
      setIsLoading(false);
    }
  };

  if (error && !inviteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              className="w-full mt-4" 
              onClick={() => navigate('/')}
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta Criada!</h2>
            <p className="text-gray-600 mb-6">
              Sua conta foi criada com sucesso. Verifique seu e-mail para confirmar e ativar sua conta.
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              Ir para o Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TecnoChamados</h1>
          <p className="text-gray-600 mt-2">Ativar Conta</p>
        </div>

        {/* Invite Card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Bem-vindo!</CardTitle>
            <CardDescription className="text-center">
              Complete seu cadastro criando uma senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inviteData && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Seus dados:</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><strong>Nome:</strong> {inviteData.name}</p>
                  <p><strong>E-mail:</strong> {inviteData.email}</p>
                  <p><strong>Função:</strong> {inviteData.role}</p>
                  <p><strong>Departamento:</strong> {inviteData.department}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Create Account Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Criando conta...
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 TecnoChamados. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}; 