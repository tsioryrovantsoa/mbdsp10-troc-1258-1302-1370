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
using System.Windows.Forms.DataVisualization.Charting;
using System.Net.Http.Headers;

namespace troc
{
    public partial class Statistic : BaseFormWithNavbar
    {
        private readonly HttpClient _httpClient;
        private Chart chartCategories;
        private TableLayoutPanel mainTable;

        public Statistic()
        {
            InitializeComponent();
            _httpClient = new HttpClient();
            InitializeCharts();
            LoadCategoryStatistics();
        }

        private void InitializeCharts()
        {
            // Création du tableau principal
            mainTable = new TableLayoutPanel
            {
                Dock = DockStyle.None,
                RowCount = 1,
                ColumnCount = 3,
                AutoSize = true
            };

            // Calcul de la position Y pour placer le tableau sous la barre de navigation
            int yPosition = navbarPanel.Bottom;

            // Définir la position et la taille du tableau
            mainTable.Location = new Point(0, yPosition);
            mainTable.Size = new Size(this.ClientSize.Width, this.ClientSize.Height - yPosition);

            // Initialisation des graphiques
            chartCategories = CreateChart("Statistiques des catégories");
            //chartExchanges = CreateChart("Statistiques des échanges");
            //chartLocations = CreateChart("Statistiques des lieux");

            // Ajout des graphiques au tableau
            mainTable.Controls.Add(chartCategories, 0, 0);
            //mainTable.Controls.Add(chartExchanges, 1, 0);
            //mainTable.Controls.Add(chartLocations, 2, 0);

            // Définition des colonnes à taille égale
            mainTable.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.33F));
            mainTable.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.33F));
            mainTable.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.33F));

            this.Controls.Add(mainTable);

            // Ajout d'un gestionnaire d'événements pour le redimensionnement du formulaire
            this.Resize += Statistic_Resize;
        }

        private void Statistic_Resize(object sender, EventArgs e)
        {
            // Mise à jour de la taille du tableau lors du redimensionnement du formulaire
            if (mainTable != null)
            {
                mainTable.Size = new Size(this.ClientSize.Width, this.ClientSize.Height - navbarPanel.Bottom);
            }
        }

        private Chart CreateChart(string title)
        {
            var chart = new Chart
            {
                Dock = DockStyle.Fill,
                AntiAliasing = AntiAliasingStyles.All,
                TextAntiAliasingQuality = TextAntiAliasingQuality.High
            };

            var chartArea = new ChartArea();
            chart.ChartAreas.Add(chartArea);


            var series = new Series
            {
                ChartType = SeriesChartType.Column
            };
            chart.Series.Add(series);

            chart.Titles.Add(new Title(title));

            return chart;
        }

        private async Task LoadCategoryStatistics()
        {
            try
            {
                string apiUrl = "http://localhost:3001/api/statistic/categ?limit=5";
                var stats = await GetDataFromApi<CategoryStat>(apiUrl);
                UpdateChart(chartCategories, stats, s => s._id, s => s.count, "Catégories", "Nombre");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Erreur lors du chargement des statistiques de catégories : {ex.Message}");
            }
        }

        public async Task<List<T>> GetDataFromApi<T>(string apiUrl)
        {
            if (!TokenManager.IsTokenValid())
            {
                throw new UnauthorizedAccessException("Le token n'est pas valide. Veuillez vous reconnecter.");
            }

            string token = TokenManager.GetToken();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);
            
            if (response.IsSuccessStatusCode)
            {
                string content = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<List<T>>(content);
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                throw new UnauthorizedAccessException("Accès non autorisé. Votre session a peut-être expiré. Veuillez vous reconnecter.");
            }
            
            throw new Exception($"Erreur API: {response.StatusCode}");
        }

        private void UpdateChart<T>(Chart chart, List<T> data, Func<T, string> getCategory, Func<T, int> getValue, string xAxisTitle, string yAxisTitle)
        {
            chart.Series[0].Points.Clear();
            foreach (var item in data)
            {
                chart.Series[0].Points.AddXY(getCategory(item), getValue(item));
            }
            chart.ChartAreas[0].AxisX.Title = xAxisTitle;
            chart.ChartAreas[0].AxisY.Title = yAxisTitle;
        }
    }
}
