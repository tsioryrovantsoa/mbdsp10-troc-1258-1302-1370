using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace troc
{
    public partial class UserDashboardForm : Form
    {
        public UserDashboardForm()
        {
            InitializeComponent();
            InitializeListView();
        }

        private void InitializeListView()
        {
            //// Exemple de configuration des colonnes du ListView
            //listView1.View = View.Details;  // Définit l'affichage en mode Détails
            //listView1.Columns.Add("Column 1", 100, HorizontalAlignment.Left);  // Ajoute une colonne
            //listView1.Columns.Add("Column 2", 100, HorizontalAlignment.Left);

            //// Exemple d'ajout d'éléments au ListView
            //ListViewItem item1 = new ListViewItem("Item 1");
            //item1.SubItems.Add("Subitem 1-2");
            //listView1.Items.Add(item1);

            //ListViewItem item2 = new ListViewItem("Item 2");
            //item2.SubItems.Add("Subitem 2-2");
            //listView1.Items.Add(item2);
        }
    }
}
