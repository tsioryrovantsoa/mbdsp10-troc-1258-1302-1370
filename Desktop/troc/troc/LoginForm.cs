using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace troc
{
    public partial class LoginForm : Form
    {
        private const string API_URL = "https://mbdsp10-troc-1258-1302-1370-spring.onrender.com/api/auth/login";

        public LoginForm()
        {
            InitializeComponent();
            InitializeLoginForm();
        }

        private void InitializeLoginForm()
        {
            // Création des contrôles
            TextBox txtUsername = new TextBox { Location = new Point(100, 60), Size = new Size(150, 20) };
            TextBox txtPassword = new TextBox { Location = new Point(100, 90), Size = new Size(150, 20), UseSystemPasswordChar = true };
            Button btnLogin = new Button { Text = "Se connecter", Location = new Point(100, 120), Size = new Size(150, 20) };
            Label lblMessage = new Label { Location = new Point(100, 40), AutoSize = true };
            Label lblConnexion = new Label { Text = "Connectez-vous!", Location = new Point(100, 20), AutoSize = true };

            // Ajout des contrôles au formulaire
            Controls.AddRange(new Control[] { txtUsername, txtPassword, btnLogin, lblMessage, lblConnexion });

            // Ajout de l'événement Click au bouton
            btnLogin.Click += async (sender, e) =>
            {
                btnLogin.Enabled = false;
                lblMessage.Text = "Connexion en cours...";

                try
                {
                    bool isAuthenticated = await AuthenticateUser(txtUsername.Text, txtPassword.Text);
                    if (isAuthenticated)
                    {
                        OpenHomePage();
                    }
                    else
                    {
                        lblMessage.Text = "Nom d'utilisateur ou mot de passe incorrect. Veuillez réessayer";
                    }
                }
                catch (Exception ex)
                {
                    lblMessage.Text = $"Échec de l'authentification. Veuillez réessayer. Erreur : {ex.Message}";
                }
                finally
                {
                    btnLogin.Enabled = true;
                }
            };
        }

        private async Task<bool> AuthenticateUser(string username, string password)
        {
            using (var client = new HttpClient())
            {
                var content = new StringContent(JsonConvert.SerializeObject(new
                {
                    username,
                    password
                }), Encoding.UTF8, "application/json");

                var response = await client.PostAsync(API_URL, content);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    System.Diagnostics.Debug.WriteLine($"Response : {responseContent}");
                    var tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(responseContent);
                    System.Diagnostics.Debug.WriteLine($"Token : {tokenResponse.accessToken}");
                    TokenManager.SaveToken(tokenResponse.accessToken);
                    return true;
                }
                return false;
            }
        }

        private void OpenHomePage()
        {
            Hide();
            new HomePage().ShowDialog();
            Close();
        }
    }
}
