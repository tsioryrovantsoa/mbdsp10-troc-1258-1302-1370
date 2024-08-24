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
        private const string ApiUrl = "http://localhost:8080/api/users";

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

            string[] columns = { "User ID", "Username", "Name", "Email", "Phone", "Address", "Role", "Created At", "Updated At", "Deleted At", "Enabled" };
            int[] columnWidths = { 80, 120, 150, 200, 120, 200, 100, 150, 150, 150, 80 };

            for (int i = 0; i < columns.Length; i++)
            {
                listView1.Columns.Add(columns[i], columnWidths[i], HorizontalAlignment.Left);
            }

            var deleteButton = new Button
            {
                Text = "Supprimer",
                Location = new Point(50, 400),
                Size = new Size(100, 23)
            };
            deleteButton.Click += DeleteButton_Click;
            Controls.Add(deleteButton);
        }

        private async void LoadUsersFromApi()
        {
            if (!TokenManager.IsTokenValid())
            {
                MessageBox.Show("Le token n'est pas valide. Veuillez vous reconnecter.");
                return;
            }

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", TokenManager.GetToken());

                HttpResponseMessage response = await client.GetAsync(ApiUrl);
                if (!response.IsSuccessStatusCode)
                {
                    MessageBox.Show(response.StatusCode == System.Net.HttpStatusCode.Unauthorized
                        ? "Accès non autorisé. Votre session a peut-être expiré. Veuillez vous reconnecter."
                        : "Erreur lors de la récupération des données.");
                    return;
                }

                string jsonResponse = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<PagedResponse<User>>(jsonResponse);

                listView1.Items.Clear();
                foreach (var user in result.Content)
                {
                    AddUserToListView(user);
                }
            }
        }

        private void AddUserToListView(User user)
        {
            var listViewItem = new ListViewItem(user.User_Id.ToString());
            listViewItem.SubItems.Add(user.Username);
            listViewItem.SubItems.Add(user.Name);
            listViewItem.SubItems.Add(user.Email);
            listViewItem.SubItems.Add(user.Phone);
            listViewItem.SubItems.Add(user.Address);
            listViewItem.SubItems.Add(user.Role);
            listViewItem.SubItems.Add(user.CreatedAt.ToString("g"));
            listViewItem.SubItems.Add(user.UpdatedAt?.ToString("g") ?? "N/A");
            listViewItem.SubItems.Add(user.DeletedAt?.ToString("g") ?? "N/A");
            listViewItem.SubItems.Add(user.Enabled ? "Yes" : "No");

            if (user.DeletedAt.HasValue)
            {
                listViewItem.ForeColor = Color.Red;
            }

            listViewItem.Tag = user.User_Id;
            listView1.Items.Add(listViewItem);
        }

        private async void DeleteButton_Click(object sender, EventArgs e)
        {
            if (listView1.SelectedItems.Count == 0)
            {
                MessageBox.Show("Veuillez sélectionner un utilisateur à supprimer.");
                return;
            }

            var selectedItem = listView1.SelectedItems[0];
            int userId = (int)selectedItem.Tag;

            if (selectedItem.ForeColor == Color.Red)
            {
                MessageBox.Show("Cet utilisateur est déjà supprimé et ne peut pas être supprimé à nouveau.");
                return;
            }

            if (MessageBox.Show($"Êtes-vous sûr de vouloir supprimer l'utilisateur ID {userId} ?", "Confirmation de suppression", MessageBoxButtons.YesNo) == DialogResult.Yes)
            {
                await DeleteUser(userId);
            }
        }

        private async Task DeleteUser(int userId)
        {
            if (!TokenManager.IsTokenValid())
            {
                MessageBox.Show("Le token n'est pas valide. Veuillez vous reconnecter.");
                return;
            }

            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", TokenManager.GetToken());

                HttpResponseMessage response = await client.DeleteAsync($"{ApiUrl}/{userId}");
                if (response.IsSuccessStatusCode)
                {
                    MessageBox.Show("Utilisateur supprimé avec succès.");
                    LoadUsersFromApi();
                }
                else
                {
                    MessageBox.Show("Erreur lors de la suppression de l'utilisateur.");
                }
            }
        }
    }
}
