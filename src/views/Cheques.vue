<template>
  <v-container>
    <v-card width="800">
      <v-card-title class="pa-0 pl-2">
        Cheques
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              fab
              dark
              small
              color="error"
              @click="$router.push('/')"
              v-on="on"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </template>
          <span>Cerrar</span>
        </v-tooltip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-layout class="mb-3">
          <v-select
            :items="$store.state.tipo_fondo"
            v-model="data.tipo_fondo"
            label="Tipo de fondo:"
            class="mr-2"
            dense hide-details
          ></v-select>
          <v-select
            :items="$store.state.sucursales"
            v-model="data.sucursal"
            label="Sucursal:"
            class="mr-2"
            dense hide-details
            v-if="data.tipo_fondo==1"
          ></v-select>
          <v-select
            :items="$store.state.fondos.filter(f=>{return f.tipo==2})"
            v-model="data.fondo"
            label="Fondo:"
            class="mr-2"
            dense hide-details
            v-if="data.tipo_fondo==2"
          ></v-select>
        </v-layout>
        <v-card>
          <v-card-text>
            <v-layout>
              <v-text-field
                label="Número:"
                v-model="data.numero"
                class="mr-2"
                dense
                hide-details
              ></v-text-field>
              <v-text-field
                label="Fecha:"
                v-model="data.fecha"
                type="date"
                class="mr-2"
                dense
                hide-details
              ></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field
                label="Págese a la orden de:"
                v-model="data.nombre"
                class="mr-2"
                dense
                hide-details
              ></v-text-field>
              <div class="pa-3">la cantidad de: <strong class="large-text">{{data.cantidad}}{{` ${cantidadEnLetras}`}}</strong></div>
              
            </v-layout>
            <v-text-field
              label="Concepto:"
              v-model="data.concepto"
              multi-line
              class="mr-2"
              dense
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
        <v-card class="mt-2" height="300">
          <v-card-title class="pa-0 pl-2"
            >Detalle contable
            <v-spacer></v-spacer>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn small fab dark class="success" v-on="on" @click="dlgAdd=true"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </template>
              <span>Agregar cuenta</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-simple-table fixed-header dense>
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Descripción</th>
                  <th>Débito</th>
                  <th>Crédito</th>
                  <th v-if="cuentas.length>0">Quitar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(cta,i) in cuentas" :key="i">
                  <td>{{ cta.cuenta }}</td>
                  <td>{{ cta.descripción }}</td>
                  <td class="text-right">{{ cta.debe }}</td>
                  <td class="text-right">{{ cta.haber }}</td>
                  <td><v-btn text small color="red" @click="cuentas.splice(i,1)"><v-icon>mdi-close</v-icon></v-btn></td>
                </tr>
              </tbody>
              <tfoot v-if="totales.debe>0 || totales.haber>0">
                  <tr>
                      <th colspan=2 class="text-right">
                          TOTALES:
                      </th>
                      <th class="text-right">
                          {{totales.debe}}
                      </th>
                      <th class="text-right">
                          {{totales.haber}}
                      </th>
                  </tr>
              </tfoot>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn fab dark small color="primary" v-on="on" v-if="totales.ok"
              ><v-icon>mdi-content-save</v-icon></v-btn
            >
          </template>
          <span>Guardar</span>
        </v-tooltip>

        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dlgAdd" width="500">
        <v-card>
            <v-card-title class="pa-0 pl-2 grey lighten-4">Agregar cuenta <v-spacer></v-spacer><v-btn small dark fab color="error" @click="dlgAdd=false"><v-icon>mdi-close</v-icon></v-btn></v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-autocomplete :items="$store.getters.cuentasDetalle(find)" item-value="id" item-text="fullText" label="Cuenta:" v-model="nueva.id"></v-autocomplete>
                <v-layout row class="pa-3">
                   <v-text-field dense hide-details v-model="nueva.debe" label="Debe:" class="mr-2 text-right" type="number"></v-text-field> 
                   <v-text-field dense hide-details v-model="nueva.haber" label="Haber" class="mr-2 text-right" type="number"></v-text-field>
                </v-layout>
                
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn fab dark small color="primary" @click="agregarCuenta()"><v-icon>mdi-check</v-icon></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import utils from "../../utils.js"
export default {
  data() {
    return {
      data: {
        fondo: 0,
        sucurasl: 0,
        fecha:'',
        nombre:'',
        concepto:'',
        cantidad:0,
        tipo_fondo:1
      },
      cuentas: [],
      nueva:{debe:0,haber:0,id:'',cuenta:'',descripción:''},
      dlgAdd:false,
      find:'',
      showSave:false
    };
  },
  methods:{
      agregarCuenta:function(){
          var mv=this
          var cuenta = mv.$store.getters.dlookup({tabla:'catálogo',campo:'id',valor:mv.nueva.id})
          mv.nueva.cuenta=cuenta.cuenta
          mv.nueva.descripción=cuenta.descripción
          mv.cuentas.push(
              Object.assign({},mv.nueva)
          )
          mv.nueva.debe=0
          mv.nueva.haber=0
          mv.nueva.id=0
          mv.nueva.cuenta=''
          mv.nueva.descripción=''
      }
  },
  computed:{
      totales:function(){
          var mv=this
          var result={debe:0,haber:0,ok:false}
          mv.cuentas.forEach(cta=>{
              result.debe+=parseFloat(cta.debe)
              result.haber+=parseFloat(cta.haber)
          })
          if(result.debe===result.haber){result.ok=true;mv.data.cantidad=result.debe}else{mv.data.cantidad=0}
          return result
      },
      cantidadEnLetras:function(){
        var mv=this
        return utils.num2Letras(mv.data.cantidad,".","córdobas")
      }
  }

};
</script>

<style>
    .large-text{
        font-size: 18px;
    }
</style>
