using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using troc.entities;

namespace troc
{
    public partial class HomePage : BaseFormWithNavbar
    {
        private TextBox searchBox;
        private ComboBox categoryComboBox;
        private ComboBox statusComboBox;
        private Button searchButton;
        private ListView itemListView;
        private Button detailButton;

        public HomePage()
        {
            InitializeComponent();
            InitializeControls();
            LoadItems();

            Text = "Page d'accueil";
            Label welcomeLabel = new Label
            {
                Text = "Item List",
                Location = new Point(250, 120),
                AutoSize = true
            };
            Controls.Add(welcomeLabel);
        }

        private void InitializeControls()
        {
            searchBox = new TextBox
            {
                Location = new Point(50, 150),
                Size = new Size(200, 20)
            };
            Controls.Add(searchBox);

            // Commenté pour simplification
            /*categoryComboBox = new ComboBox
            {
                Location = new Point(260, 50),
                Size = new Size(120, 20)
            };
            categoryComboBox.Items.AddRange(new object[] { "Categorie1", "Categorie2", "Categorie3" });
            Controls.Add(categoryComboBox);

            statusComboBox = new ComboBox
            {
                Location = new Point(390, 50),
                Size = new Size(120, 20)
            };
            statusComboBox.Items.AddRange(new object[] { "Status1", "Status2", "Status3" });
            Controls.Add(statusComboBox);*/

            searchButton = new Button
            {
                Text = "Search",
                Location = new Point(520, 150),
                Size = new Size(80, 23)
            };
            searchButton.Click += SearchButton_Click;
            Controls.Add(searchButton);

            itemListView = new ListView
            {
                Location = new Point(50, 190),
                Size = new Size(500, 200),
                View = View.Details,
                FullRowSelect = true
            };
            itemListView.Columns.Add("Title", 100);
            itemListView.Columns.Add("Description", 200);
            itemListView.Columns.Add("Category", 100);
            itemListView.Columns.Add("Actions", 100); // Nouvelle colonne pour les actions
            Controls.Add(itemListView);

            // Ajouter l'événement pour gérer les clics sur les cellules du ListView
            itemListView.MouseClick += ItemListView_MouseClick;

            detailButton = new Button
            {
                Text = "Detail",
                Location = new Point(50, 390),
                Size = new Size(100, 23)
            };
            detailButton.Click += DetailButton_Click;
            Controls.Add(detailButton);
        }

        private async void SearchButton_Click(object sender, EventArgs e)
        {
            await LoadItems();
        }

        private void DetailButton_Click(object sender, EventArgs e)
        {
            if (itemListView.SelectedItems.Count > 0)
            {
                long itemId = (long)itemListView.SelectedItems[0].Tag;
                var detailForm = new ItemDetail(itemId);
                detailForm.ShowDialog();
            }
            else
            {
                MessageBox.Show("Veuillez sélectionner un item pour voir les détails.");
            }
        }

        private async Task LoadItems()
        {
            using (var client = new HttpClient())
            {
                string baseUrl = "https://mbdsp10-troc-1258-1302-1370-spring.onrender.com/api/items/search";
                string keyword = searchBox.Text;

                string url = $"{baseUrl}?keyword={keyword}&page=0&size=10";

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
                    var result = JsonConvert.DeserializeObject<PagedResponse<Item>>(jsonResponse);

                    itemListView.Items.Clear();
                    foreach (var item in result.Content)
                    {
                        var listViewItem = new ListViewItem(new[]
                        {
                            item.Title,
                            item.Description,
                            item.Category.ToString(),
                            "Edit | Delete" // Texte cliquable pour les actions
                        })
                        {
                            Tag = item.ItemId
                        };

                        itemListView.Items.Add(listViewItem);
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

        private async void ItemListView_MouseClick(object sender, MouseEventArgs e)
        {
            ListViewHitTestInfo hitTest = itemListView.HitTest(e.X, e.Y);
            if (hitTest.Item != null)
            {
                int columnIndex = hitTest.Item.SubItems.IndexOf(hitTest.SubItem);
                if (columnIndex == 3) // Colonne des actions
                {
                    var itemId = (long)hitTest.Item.Tag;
                    var text = hitTest.SubItem.Text;

                    // Vérifiez sur quel texte l'utilisateur a cliqué
                    if (e.X >= hitTest.SubItem.Bounds.Left && e.X <= hitTest.SubItem.Bounds.Left + 40) // Ajustez les limites pour "Edit"
                    {
                        MessageBox.Show($"Modifier l'item avec ID {itemId}");
                    }
                    else if (e.X >= hitTest.SubItem.Bounds.Left + 50) // Ajustez les limites pour "Delete"
                    {
                        using (var client = new HttpClient())
                        {
                            string baseUrl = "https://mbdsp10-troc-1258-1302-1370-spring.onrender.com/api/items";
                            string keyword = searchBox.Text;

                            string url = $"{baseUrl}/{itemId}"; ;

                            if (!TokenManager.IsTokenValid())
                            {
                                MessageBox.Show("Le token n'est pas valide. Veuillez vous reconnecter.");
                                return;
                            }

                            // Récupérer le token
                            string token = TokenManager.GetToken();

                            // Ajouter le token dans l'en-tête de la requête
                            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                            HttpResponseMessage response = await client.DeleteAsync(url);
                            if (response.IsSuccessStatusCode)
                            {
                                MessageBox.Show($"Item avec ID {itemId} supprimé");
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
        }
    }

    public class PagedResponse<T>
    {
        public List<T> Content { get; set; }
        public int TotalPages { get; set; }
        public int TotalElements { get; set; }
    }
}
