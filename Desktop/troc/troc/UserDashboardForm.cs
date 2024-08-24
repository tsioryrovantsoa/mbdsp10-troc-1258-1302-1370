using Newtonsoft.Json;
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
using troc.entities;

namespace troc
{
    public partial class UserDashboardForm : BaseFormWithNavbar
    {
        public UserDashboardForm()
        {
            InitializeComponent();
            InitializeListView();
            LoadUsersFromApi();
        }

        private void InitializeListView()
        {
            listView1.View = View.Details;
            listView1.Columns.Add("User ID", 80, HorizontalAlignment.Left);
            listView1.Columns.Add("Username", 120, HorizontalAlignment.Left);
            listView1.Columns.Add("Name", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Email", 200, HorizontalAlignment.Left);
            listView1.Columns.Add("Phone", 120, HorizontalAlignment.Left);
            listView1.Columns.Add("Address", 200, HorizontalAlignment.Left);
            listView1.Columns.Add("Role", 100, HorizontalAlignment.Left);
            listView1.Columns.Add("Created At", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Updated At", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Enabled", 80, HorizontalAlignment.Left);
        }

        private async void LoadUsersFromApi()
        {
            using (var client = new HttpClient())
            {
                string url = "http://localhost:8080/api/users";

                if (!TokenManager.IsTokenValid())
                {
                    MessageBox.Show("Le token n'est pas valide. Veuillez vous reconnecter.");
                    return;
                }

                // Récupérer le token
                string token = TokenManager.GetToken();

                // Ajouter le token dans l'en-tête de la requête
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                HttpResponseMessage response = await client.GetAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var result = JsonConvert.DeserializeObject<PagedResponse<User>>(jsonResponse);
                    

                    listView1.Items.Clear();
                    foreach (var user in result.Content)
                    {
                        var listViewItem = new ListViewItem(user.User_Id.ToString());
                        listViewItem.SubItems.Add(user.Username);
                        listViewItem.SubItems.Add(user.Name);
                        listViewItem.SubItems.Add(user.Email);
                        listViewItem.SubItems.Add(user.Phone);
                        listViewItem.SubItems.Add(user.Address);
                        listViewItem.SubItems.Add(user.Role);
                        listViewItem.SubItems.Add(user.CreatedAt.ToString("g"));
                        listViewItem.SubItems.Add(user.UpdatedAt.HasValue ? user.UpdatedAt.Value.ToString("g") : "N/A");
                        listViewItem.SubItems.Add(user.Enabled ? "Yes" : "No");
                        listView1.Items.Add(listViewItem);
                    }
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    MessageBox.Show("Accès non autorisé. Votre session a peut-être expiré. Veuillez vous reconnecter.");
                }
                else
                {
                    MessageBox.Show("Erreur lors de la récupération des données.");
                }
            }
        }
    }
}
