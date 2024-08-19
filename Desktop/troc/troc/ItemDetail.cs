using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using troc.entities;

namespace troc
{
    public partial class ItemDetail : BaseFormWithNavbar
    {
        private long itemId;
        private string baseUrl = "http://localhost:8080/api/items";
        //private HttpClient client;

        // Contrôles du formulaire
        private Label lblTitle;
        private TextBox txtDescription;
        private Label lblCategory;
        private Label lblStatus;
        private Label lblCreatedAt;
        private Label lblUpdatedAt;
        private FlowLayoutPanel flowLayoutPanelImages;

        public ItemDetail(long itemId)
        {
            InitializeComponent();
            InitializeControls();
            this.itemId = itemId;
            // this.client = new HttpClient();
            // this.client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TokenManager.GetToken());
        }

        private void InitializeControls()
        {
            this.lblTitle = new Label();
            this.txtDescription = new TextBox();
            this.lblCategory = new Label();
            this.lblStatus = new Label();
            this.lblCreatedAt = new Label();
            this.lblUpdatedAt = new Label();
            this.flowLayoutPanelImages = new FlowLayoutPanel();

            // Configuration des contrôles
            this.lblTitle.Location = new Point(200, 120);
            this.lblTitle.AutoSize = true;
            this.lblTitle.Font = new Font(lblTitle.Font.FontFamily, 16, FontStyle.Bold);

            this.txtDescription.Location = new Point(20, 300);
            this.txtDescription.Size = new Size(200, 200);
            this.txtDescription.Multiline = true;
            this.txtDescription.ReadOnly = true;

            this.lblCategory.Location = new Point(20, 170);
            this.lblCategory.AutoSize = true;

            this.lblStatus.Location = new Point(20, 200);
            this.lblStatus.AutoSize = true;

            this.lblCreatedAt.Location = new Point(20, 230);
            this.lblCreatedAt.AutoSize = true;

            this.lblUpdatedAt.Location = new Point(20, 260);
            this.lblUpdatedAt.AutoSize = true;

            this.flowLayoutPanelImages.Location = new Point(250, 300);
            this.flowLayoutPanelImages.Size = new Size(200, 200);
            this.flowLayoutPanelImages.AutoScroll = true;

            // Ajout des contrôles au formulaire
            this.Controls.Add(this.lblTitle);
            this.Controls.Add(this.txtDescription);
            this.Controls.Add(this.lblCategory);
            this.Controls.Add(this.lblStatus);
            this.Controls.Add(this.lblCreatedAt);
            this.Controls.Add(this.lblUpdatedAt);
            this.Controls.Add(this.flowLayoutPanelImages);

            //this.ClientSize = new Size(450, 520);
            this.Text = "Détails de l'item";
            this.Load += new EventHandler(ItemDetail_Load);
        }

        private async void ItemDetail_Load(object sender, EventArgs e)
        {
            await LoadItemDetails();
        }

        private async Task LoadItemDetails()
        {
            using (var client = new HttpClient())
            {
                try
                {
                    string url = $"{baseUrl}/{itemId}";

                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TokenManager.GetToken());
                    HttpResponseMessage response = await client.GetAsync(url);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        var item = JsonConvert.DeserializeObject<Item>(jsonResponse);

                        // Afficher les détails de l'item
                        lblTitle.Text = item.Title;
                        txtDescription.Text = item.Description;
                        lblCategory.Text = $"Catégorie : {item.Category}";
                        lblStatus.Text = $"Statut : {item.Status}";
                        lblCreatedAt.Text = $"Créé le : {item.CreatedAt.ToString("dd/MM/yyyy HH:mm")}";
                        lblUpdatedAt.Text = $"Mis à jour le : {item.UpdatedAt.ToString("dd/MM/yyyy HH:mm")}";

                        // Charger les images
                        await LoadImages(item.Images);
                    }
                    else
                    {
                        MessageBox.Show($"Erreur lors du chargement des détails de l'item. Statut : {response.StatusCode}");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Une erreur est survenue : {ex.Message}");
                }
            }
        }

        private async Task LoadImages(List<Images> images)
        {
            flowLayoutPanelImages.Controls.Clear();

            foreach (var image in images)
            {
                using (var client = new HttpClient())
                {
                    try
                    {
                        string url = $"{baseUrl}/images/{image.ImageId}";
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", TokenManager.GetToken());
                        var response = await client.GetAsync(url);

                        if (response.IsSuccessStatusCode)
                        {
                            using (var stream = await response.Content.ReadAsStreamAsync())
                            {
                                var pictureBox = new PictureBox
                                {
                                    Size = new Size(200, 200),
                                    SizeMode = PictureBoxSizeMode.Zoom,
                                    Image = Image.FromStream(stream)
                                };
                                flowLayoutPanelImages.Controls.Add(pictureBox);
                            }
                        }
                        else
                        {
                            MessageBox.Show($"Erreur lors du chargement de l'image {image.ImageId}. Statut : {response.StatusCode}");
                        }
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show($"Une erreur est survenue lors du chargement de l'image : {ex.Message}");
                    }
                }
            }
        }
    }
}
