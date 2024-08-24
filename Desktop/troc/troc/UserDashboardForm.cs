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
            listView1.FullRowSelect = true;
            listView1.Columns.Add("User ID", 80, HorizontalAlignment.Left);
            listView1.Columns.Add("Username", 120, HorizontalAlignment.Left);
            listView1.Columns.Add("Name", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Email", 200, HorizontalAlignment.Left);
            listView1.Columns.Add("Phone", 120, HorizontalAlignment.Left);
            listView1.Columns.Add("Address", 200, HorizontalAlignment.Left);
            listView1.Columns.Add("Role", 100, HorizontalAlignment.Left);
            listView1.Columns.Add("Created At", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Updated At", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Deleted At", 150, HorizontalAlignment.Left);
            listView1.Columns.Add("Enabled", 80, HorizontalAlignment.Left);

            Button deleteButton = new Button
            {
                Text = "Supprimer",
                Location = new System.Drawing.Point(50, 400),
                Size = new System.Drawing.Size(100, 23)
            };
            deleteButton.Click += DeleteButton_Click;
            Controls.Add(deleteButton);
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
                        listViewItem.SubItems.Add(user.DeletedAt?.ToString("g") ?? "N/A");
                        listViewItem.SubItems.Add(user.Enabled ? "Yes" : "No");

                        if (user.DeletedAt.HasValue)
                        {
                            listViewItem.ForeColor = Color.Red; // Mettre en rouge les utilisateurs supprimés
                        }

                        listViewItem.Tag = user.User_Id;
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

        private async void DeleteButton_Click(object sender, EventArgs e)
        {
            if (listView1.SelectedItems.Count > 0)
            {
                var selectedItem = listView1.SelectedItems[0];
                int userId = (int)selectedItem.Tag;

                if (selectedItem.ForeColor == Color.Red)
                {
                    MessageBox.Show("Cet utilisateur est déjà supprimé et ne peut pas être supprimé à nouveau.");
                    return;
                }

                DialogResult dialogResult = MessageBox.Show($"Êtes-vous sûr de vouloir supprimer l'utilisateur ID {userId} ?", "Confirmation de suppression", MessageBoxButtons.YesNo);

                if (dialogResult == DialogResult.Yes)
                {
                    await DeleteUser(userId);
                }
            }
            else
            {
                MessageBox.Show("Veuillez sélectionner un utilisateur à supprimer.");
            }
        }

        private async Task DeleteUser(int userId)
        {
            using (var client = new HttpClient())
            {
                string url = $"http://localhost:8080/api/users/{userId}";

                if (!TokenManager.IsTokenValid())
                {
                    MessageBox.Show("Le token n'est pas valide. Veuillez vous reconnecter.");
                    return;
                }

                string token = TokenManager.GetToken();
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                HttpResponseMessage response = await client.DeleteAsync(url);
                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Utilisateur supprimé avec succès.");
                    LoadUsersFromApi(); // Recharger la liste des utilisateurs après suppression
                }
                else
                {
                    MessageBox.Show("Erreur lors de la suppression de l'utilisateur.");
                }
            }
        }
    }
}
